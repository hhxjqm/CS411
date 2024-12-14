import request from "./base"
import { User } from "./user";

export interface Transaction {
    TransactionId: number;
    GroupId: number;
    Amount: number;
    CurrencyType: string;
    Date: string;
    SenderId: number;
    ReceiverId: number;
}


export interface GetTransactionsResponse {
    sentTransactions: (Transaction & User)[];
    receivedTransactions: (Transaction & User)[];
}

export async function createTransaction(data: Transaction): Promise<Transaction> {
    const res = await request.post("/transaction", data)
    return res.data
}

export async function getTransactions(userId: number): Promise<GetTransactionsResponse> {
    const res = await request.get(`/transaction/${userId}`)
    console.log('Response Data:', res.data);
    return res.data
}
