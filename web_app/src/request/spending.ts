import request from "./base";
import { User } from "./user";

// interface SpendingRequest {
//     UserId: string;
// }

export interface SpendingUpdate {
    CurrencyType: string;
    Amount: number;
    SenderId: string;
    Date: string;
}

export interface Spending {
    SpendingId: number;
    CurrencyType: string;
    Category: string;
    GroupId: number;
    Amount: number;
}

export interface SpendingCreation {
    CurrencyType: string;
    Category: string;
    GroupId: number;
    Amount: number;
}

export interface GetSpendingResponse {
    sendSpending: (Spending & User)[];
    receivedSpending: (Spending & User)[];
}


export async function createSpending(data: SpendingCreation): Promise<Spending> {
    const res = await request.post("/spending", data)
    return res.data
}

export async function getSpending(id: number): Promise<GetSpendingResponse> {
    const res = await request.get(`/spending/${id}`)
    console.log('Response Data:', res.data);
    return res.data
}   

export async function updateSpending(id: number, data: SpendingUpdate) {
    const res = await request.put(`/spending/${id}`, data)
    return res.data
}

export async function deleteSpending(id: number): Promise<void> {
    return request.delete(`/spending/${id}`)
}
