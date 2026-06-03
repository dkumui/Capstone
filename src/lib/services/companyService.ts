import { DEFAULT_COMPANY_SETTINGS, DEFAULT_SERVICES } from '$lib/config/defaults';
import { createServerSupabaseClient } from '$lib/supabase/server';
import type { CompanySettings, ServiceItem } from '$lib/types/domain';
import { createAdminSupabaseClient } from '$lib/supabase/admin';

export async function getCompanySettings(): Promise<CompanySettings> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return DEFAULT_COMPANY_SETTINGS;

  const { data, error } = await supabase.from('company_settings').select('*').limit(1).maybeSingle();
  if (error) {
    console.error('Failed to fetch company settings:', error.message);
    return DEFAULT_COMPANY_SETTINGS;
  }
  if (!data) return DEFAULT_COMPANY_SETTINGS;

  return {
    id: data.id,
    businessName: data.business_name,
    altBusinessName: data.alt_business_name,
    description: data.description,
    address: data.address,
    whatsappNumber: data.whatsapp_number,
    contactPhone: data.contact_phone,
    operationHours: data.operation_hours,
    googleMapsLink: data.google_maps_link
  };
}

export async function getServices(): Promise<ServiceItem[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return DEFAULT_SERVICES;

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch services:', error.message);
    return DEFAULT_SERVICES;
  }
  if (!data || data.length === 0) return DEFAULT_SERVICES;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isActive: item.is_active
  }));
}

export interface UpdateCompanySettingsInput {
	businessName: string;
	altBusinessName: string;
	description: string;
	address: string;
	whatsappNumber: string;
	contactPhone: string;
	operationHours: string;
	googleMapsLink: string;
}

export async function updateCompanySettings(input: UpdateCompanySettingsInput): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { data: existing, error: findError } = await supabase
		.from('company_settings')
		.select('id')
		.limit(1)
		.maybeSingle();

	if (findError) {
		return {
			success: false,
			message: findError.message
		};
	}

	if (!existing) {
		const { error } = await supabase.from('company_settings').insert({
			business_name: input.businessName,
			alt_business_name: input.altBusinessName,
			description: input.description,
			address: input.address,
			whatsapp_number: input.whatsappNumber,
			contact_phone: input.contactPhone,
			operation_hours: input.operationHours,
			google_maps_link: input.googleMapsLink
		});

		if (error) {
			return {
				success: false,
				message: error.message
			};
		}

		return {
			success: true,
			message: 'Data toko berhasil dibuat.'
		};
	}

	const { error } = await supabase
		.from('company_settings')
		.update({
			business_name: input.businessName,
			alt_business_name: input.altBusinessName,
			description: input.description,
			address: input.address,
			whatsapp_number: input.whatsappNumber,
			contact_phone: input.contactPhone,
			operation_hours: input.operationHours,
			google_maps_link: input.googleMapsLink
		})
		.eq('id', existing.id);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Data toko berhasil diperbarui.'
	};
}