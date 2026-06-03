import { createAdminSupabaseClient } from '$lib/supabase/admin';

export type ChatSender = 'user' | 'assistant' | 'admin';
export type ChatSessionStatus = 'open' | 'pending' | 'closed';

export interface ChatSessionSummary {
	id: string;
	visitor_token: string | null;
	customer_name: string | null;
	customer_whatsapp: string | null;
	product_code: string | null;
	product_name: string | null;
	product_color: string | null;
	status: ChatSessionStatus;
	created_at: string;
	updated_at: string;
	last_message_at: string;
}

export interface ChatMessageItem {
	id: string;
	session_id: string;
	sender: ChatSender;
	message: string;
	created_at: string;
}

interface ProductChatContext {
	productCode?: string | null;
	productName?: string | null;
	productColor?: string | null;
}

const mockSessions = new Map<string, ChatSessionSummary>();
const mockMessages = new Map<string, ChatMessageItem[]>();

function normalizeWhatsapp(value: string | null | undefined): string | null {
	if (!value) return null;

	const digits = value.replace(/\D/g, '');

	if (!digits) return null;

	if (digits.startsWith('0')) {
		return `62${digits.slice(1)}`;
	}

	if (digits.startsWith('62')) {
		return digits;
	}

	return digits;
}

export async function persistChatSessionAndMessages(params: {
	sessionId: string;
	visitorToken: string;
	userMessage: string;
	assistantMessage: string;
	customerName?: string | null;
	customerWhatsapp?: string | null;
	productContext?: ProductChatContext;
}): Promise<{ storage: 'supabase' | 'mock' }> {
	const supabase = createAdminSupabaseClient();

	const normalizedWhatsapp = normalizeWhatsapp(params.customerWhatsapp);

	const sessionPayload: Record<string, unknown> = {
		id: params.sessionId,
		visitor_token: params.visitorToken,
		status: 'open',
		last_message_at: new Date().toISOString()
	};

	if (params.customerName?.trim()) {
		sessionPayload.customer_name = params.customerName.trim();
	}

	if (normalizedWhatsapp) {
		sessionPayload.customer_whatsapp = normalizedWhatsapp;
	}

	if (params.productContext?.productCode) {
		sessionPayload.product_code = params.productContext.productCode;
	}

	if (params.productContext?.productName) {
		sessionPayload.product_name = params.productContext.productName;
	}

	if (params.productContext?.productColor) {
		sessionPayload.product_color = params.productContext.productColor;
	}

	const messages = [
		{
			session_id: params.sessionId,
			sender: 'user',
			message: params.userMessage
		},
		{
			session_id: params.sessionId,
			sender: 'assistant',
			message: params.assistantMessage
		}
	];

	if (supabase) {
		const upsertSession = await supabase.from('chat_sessions').upsert(sessionPayload, {
			onConflict: 'id'
		});

		if (upsertSession.error) {
			console.error(`Failed to upsert chat session ${params.sessionId}:`, upsertSession.error.message);
		} else {
			const insertMessages = await supabase.from('chat_messages').insert(messages);

			if (insertMessages.error) {
				console.error(`Failed to insert chat messages for session ${params.sessionId}:`, insertMessages.error.message);
			} else {
				return { storage: 'supabase' };
			}
		}
	}

	const now = new Date().toISOString();

	const existingSession = mockSessions.get(params.sessionId);

	mockSessions.set(params.sessionId, {
		id: params.sessionId,
		visitor_token: params.visitorToken,
		customer_name: params.customerName ?? existingSession?.customer_name ?? null,
		customer_whatsapp: normalizedWhatsapp ?? existingSession?.customer_whatsapp ?? null,
		product_code: params.productContext?.productCode ?? existingSession?.product_code ?? null,
		product_name: params.productContext?.productName ?? existingSession?.product_name ?? null,
		product_color: params.productContext?.productColor ?? existingSession?.product_color ?? null,
		status: 'open',
		created_at: existingSession?.created_at ?? now,
		updated_at: now,
		last_message_at: now
	});

	const existingMessages = mockMessages.get(params.sessionId) ?? [];

	mockMessages.set(params.sessionId, [
		...existingMessages,
		{
			id: crypto.randomUUID(),
			session_id: params.sessionId,
			sender: 'user',
			message: params.userMessage,
			created_at: now
		},
		{
			id: crypto.randomUUID(),
			session_id: params.sessionId,
			sender: 'assistant',
			message: params.assistantMessage,
			created_at: now
		}
	]);

	return { storage: 'mock' };
}

export async function getAdminChatSessions(): Promise<ChatSessionSummary[]> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return Array.from(mockSessions.values()).sort((a, b) =>
			b.last_message_at.localeCompare(a.last_message_at)
		);
	}

	const { data, error } = await supabase
		.from('chat_sessions')
		.select(
			'id, visitor_token, customer_name, customer_whatsapp, product_code, product_name, product_color, status, created_at, updated_at, last_message_at'
		)
		.order('last_message_at', { ascending: false })
		.limit(100);

	if (error) {
		console.error('Failed to fetch admin chat sessions:', error.message);
		return [];
	}

	if (!data) {
		return [];
	}

	return data as ChatSessionSummary[];
}

export async function getAdminChatThread(sessionId: string): Promise<{
	session: ChatSessionSummary | null;
	messages: ChatMessageItem[];
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			session: mockSessions.get(sessionId) ?? null,
			messages: mockMessages.get(sessionId) ?? []
		};
	}

	const { data: session, error: sessionError } = await supabase
		.from('chat_sessions')
		.select(
			'id, visitor_token, customer_name, customer_whatsapp, product_code, product_name, product_color, status, created_at, updated_at, last_message_at'
		)
		.eq('id', sessionId)
		.maybeSingle();

	if (sessionError) {
		console.error(`Failed to fetch chat session ${sessionId}:`, sessionError.message);
	}

	const { data: messages, error: messagesError } = await supabase
		.from('chat_messages')
		.select('id, session_id, sender, message, created_at')
		.eq('session_id', sessionId)
		.order('created_at', { ascending: true });

	if (messagesError) {
		console.error(`Failed to fetch chat messages for session ${sessionId}:`, messagesError.message);
	}

	return {
		session: (session as ChatSessionSummary | null) ?? null,
		messages: (messages as ChatMessageItem[]) ?? []
	};
}

export async function insertAdminChatReply(params: {
	sessionId: string;
	message: string;
}): Promise<{ success: boolean; message: string }> {
	const supabase = createAdminSupabaseClient();

	if (!params.message.trim()) {
		return {
			success: false,
			message: 'Pesan balasan tidak boleh kosong.'
		};
	}

	const now = new Date().toISOString();

	if (!supabase) {
		const existing = mockMessages.get(params.sessionId) ?? [];

		mockMessages.set(params.sessionId, [
			...existing,
			{
				id: crypto.randomUUID(),
				session_id: params.sessionId,
				sender: 'admin',
				message: params.message.trim(),
				created_at: now
			}
		]);

		const session = mockSessions.get(params.sessionId);

		if (session) {
			mockSessions.set(params.sessionId, {
				...session,
				status: 'pending',
				updated_at: now,
				last_message_at: now
			});
		}

		return {
			success: true,
			message: 'Balasan admin berhasil disimpan.'
		};
	}

	const { error: insertError } = await supabase.from('chat_messages').insert({
		session_id: params.sessionId,
		sender: 'admin',
		message: params.message.trim()
	});

	if (insertError) {
		return {
			success: false,
			message: insertError.message
		};
	}

	const { error: updateError } = await supabase
		.from('chat_sessions')
		.update({
			status: 'pending',
			last_message_at: now
		})
		.eq('id', params.sessionId);

	if (updateError) {
		return {
			success: false,
			message: updateError.message
		};
	}

	return {
		success: true,
		message: 'Balasan admin berhasil disimpan.'
	};
}

export async function updateChatSessionStatus(params: {
	sessionId: string;
	status: ChatSessionStatus;
}): Promise<{ success: boolean; message: string }> {
	const supabase = createAdminSupabaseClient();

	if (!['open', 'pending', 'closed'].includes(params.status)) {
		return {
			success: false,
			message: 'Status chat tidak valid.'
		};
	}

	if (!supabase) {
		const session = mockSessions.get(params.sessionId);

		if (session) {
			mockSessions.set(params.sessionId, {
				...session,
				status: params.status,
				updated_at: new Date().toISOString()
			});
		}

		return {
			success: true,
			message: 'Status chat berhasil diperbarui.'
		};
	}

	const { error } = await supabase
		.from('chat_sessions')
		.update({
			status: params.status
		})
		.eq('id', params.sessionId);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Status chat berhasil diperbarui.'
	};
}