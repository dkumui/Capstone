import { describe, it, expect } from 'vitest';
import { getComputedStockStatus } from './inventoryService';

describe('getComputedStockStatus', () => {
	it('returns "check_stock" for null', () => {
		expect(getComputedStockStatus(null)).toBe('check_stock');
	});

	it('returns "check_stock" for undefined', () => {
		expect(getComputedStockStatus(undefined)).toBe('check_stock');
	});

	it('returns "sold_out" for 0', () => {
		expect(getComputedStockStatus(0)).toBe('sold_out');
	});

	it('returns "limited" for 1', () => {
		expect(getComputedStockStatus(1)).toBe('limited');
	});

	it('returns "limited" for 5', () => {
		expect(getComputedStockStatus(5)).toBe('limited');
	});

	it('returns "ready" for 6', () => {
		expect(getComputedStockStatus(6)).toBe('ready');
	});

	it('returns "ready" for large quantity', () => {
		expect(getComputedStockStatus(1000)).toBe('ready');
	});

	it('returns "limited" for boundary value 3', () => {
		expect(getComputedStockStatus(3)).toBe('limited');
	});
});
