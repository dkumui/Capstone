export interface ServiceResult {
	success: boolean;
	message: string;
}

export function ok(message: string): ServiceResult {
	return { success: true, message };
}

export function err(message: string): ServiceResult {
	return { success: false, message };
}
