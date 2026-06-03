import { generateRuleBasedReply } from '$lib/services/chatbot/engine';
import { persistChatSessionAndMessages } from '$lib/services/chatbot/persistence';
import { getPublicProducts } from '$lib/services/inventoryService';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const ChatRequestSchema = z.object({
	message: z.string().min(1),
	sessionId: z.string().uuid().optional().nullable(),
	productCode: z.string().optional().nullable(),
	customerName: z.string().optional().nullable(),
	customerWhatsapp: z.string().optional().nullable(),
	productName: z.string().optional().nullable(),
	productColor: z.string().optional().nullable()
});

export const POST = async ({ request, getClientAddress }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Malformed JSON body' }, { status: 400 });
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
		visitorToken: getClientAddress(),
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