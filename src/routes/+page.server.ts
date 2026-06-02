import { getCompanySettings, getServices } from '$lib/services/companyService';
import { getPublicProducts } from '$lib/services/inventoryService';
import type { CompanyProfileData, ServiceData } from '$lib/types/product-table';

export const load = async () => {
	const [companySettings, products, serviceItems] = await Promise.all([
		getCompanySettings(),
		getPublicProducts(),
		getServices()
	]);

	const company: CompanyProfileData = {
		business_name: companySettings.businessName,
		subtitle: 'Batik Cap Pekalongan untuk kebutuhan kain, jahit, dan seragam',
		profile: companySettings.description,
		address: companySettings.address,
		whatsapp_number: companySettings.whatsappNumber,
		operation_hours: companySettings.operationHours,
		maps_url: companySettings.googleMapsLink
	};

	const services: ServiceData[] = serviceItems.map((service) => ({
		id: service.id,
		title: service.title,
		description: service.description
	}));

	return {
		company,
		products,
		services
	};
};