import request from "./base";

/**
 * ExchangeRequest represents the data required to query an exchange rate.
 */
export interface ExchangeRequest {
    source: string; // Source currency in ISO format
    target: string; // Target currency in ISO format
}

/**
 * ExchangeRate represents the response structure for an exchange rate query.
 */
export interface ExchangeRate {
    Rate: number; // The exchange rate from source to target
}

/**
 * Fetch the latest exchange rate for a given source and target currency.
 * 
 * @param data - The ExchangeRequest containing source and target currencies.
 * @returns A Promise resolving to the exchange rate.
 */
export async function getExchangeRate(data: ExchangeRequest): Promise<ExchangeRate> {
    const { source, target } = data;
    const res = await request.get(`/exchange/${target}/${source}`);
    console.log('Response Data:', res.data);
    return res.data[0]; // Assuming the API returns an array of results
}
