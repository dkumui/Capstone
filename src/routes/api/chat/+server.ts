import { generateRuleBasedReply } from '$lib/services/chatbot/engine';
import { persistChatSessionAndMessages } from '$lib/services/chatbot/persistence';
import { getPublicProducts } from '$lib/services/inventoryService';
import { json } from '@sveltejs/kit';
import { createHash, randomUUID } from 'crypto';
import { z } from 'zod';

const ChatRequestSchema = z.object({
	message: z.string().min(1).max(2000),
	sessionId: z.string().uuid().optional().nullable(),
	productCode: z.string().max(50).optional().nullable(),
	customerName: z.string().max(200).optional().nullable(),
	customerWhatsapp: z.string().max(20).optional().nullable(),
	productName: z.string().max(200).optional().nullable(),
	productColor: z.string().max(100).optional().nullable()
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}

	entry.count++;
	return entry.count > RATE_LIMIT_MAX;
}

function hashIp(ip: string): string {
	return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export const POST = async ({ request, getClientAddress }) => {
	const clientIp = getClientAddress();

	if (isRateLimited(clientIp)) {
		return json({ error: 'Too many requests' }, { status: 429 });
	}

	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parsed = ChatRequestSchema.safeParse(payload);

	if (!parsed.success) {
		return json({ error: 'Invalid payload' }, { status: 400 });
	}

	const sessionId = parsed.data.sessionId ?? randomUUID();
	const products = await getPublicProducts();

	const response = generateRuleBasedReply({
		message: parsed.data.message,
		productCode: parsed.data.productCode ?? undefined,
		products
	});

	const selectedProduct = parsed.data.productCode
		? products.find((product) => product.product_code === parsed.data.productCode)
		: null;

	const persistence = await persistChatSessionAndMessages({
		sessionId,
		visitorToken: hashIp(clientIp),
		userMessage: parsed.data.message,
		assistantMessage: response.answer,
		customerName: parsed.data.customerName,
		customerWhatsapp: parsed.data.customerWhatsapp,
		productContext: {
			productCode: parsed.data.productCode ?? selectedProduct?.product_code ?? null,
			productName: parsed.data.productName ?? selectedProduct?.name ?? null,
			productColor: parsed.data.productColor ?? selectedProduct?.color_variant ?? null
		}
	});

	return json({
		answer: response.answer,
		sessionId,
		intent: response.intent,
		storage: persistence.storage
	});
};