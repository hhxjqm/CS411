import request from "./base"

interface UserRequest {
    name: string
    phone: string
}

export interface User {
    UserId: number
    Name: string
    PhoneNumber: string
    DateCreated: string
}

export async function createUser(data: UserRequest): Promise<User> {
    const res = await request.post("/user", data)
    return res.data
}

export async function getUser(id: number): Promise<User> {
    const res = await request.get(`/user/${id}`)
    return res.data
}

export async function updateUser(id: number, data: UserRequest) : Promise<User> {
    const res = await request.put(`/user/${id}`, data)
    return res.data
}

export async function deleteUser(id: number): Promise<void> {
    return request.delete(`/user/${id}`)
}