import request from "./base"
/**
 * GroupRequest is the data required to create a new group
 */
interface GroupRequest {
    GroupName: string
    CreatedBy: Number
}

export interface Group {
    GroupId: number
    GroupName: string
    UserId: number
    DateCreated: string
}


export async function createGroup(data: GroupRequest): Promise<Group> {
    const res = await request.post("/group", data)
    return res.data
}

export async function getGroups(id: number): Promise<Group[]> {
    const res = await request.get(`/group/${id}`)
    return res.data
}

export async function updateGroup(id: number, data: GroupRequest) : Promise<Group> {
    const res = await request.put(`/group/${id}`, data)
    return res.data
}

export async function deleteGroup(id: number): Promise<void> {
    return request.delete(`/group/${id}`)
}

export async function joinGroup(groupId: number, userId: number): Promise<void> {
    await request.post(`/group/${groupId}/join`, { userId });
}