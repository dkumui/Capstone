import { fail } from '@sveltejs/kit';
import { requireAdmin, getString } from '$lib/server/admin';
import { getCompanySettings, updateCompanySettings } from '$lib/services/companyService';

export const load = async ({ cookies }) => {
	requireAdmin(cookies);

	const company = await getCompanySettings();

	return {
		company
	};
};

export const actions = {
	updateCompany: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();

		const businessName = getString(formData, 'business_name');
		const address = getString(formData, 'address');

		if (!businessName || !address) {
			return fail(400, {
				message: 'Nama usaha dan alamat wajib diisi.'
			});
		}

		const result = await updateCompanySettings({
			businessName,
			altBusinessName: getString(formData, 'alt_business_name'),
			description: getString(formData, 'description'),
			address,
			whatsappNumber: getString(formData, 'whatsapp_number'),
			contactPhone: getString(formData, 'contact_phone'),
			operationHours: getString(formData, 'operation_hours'),
			googleMapsLink: getString(formData, 'google_maps_link')
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	}
};