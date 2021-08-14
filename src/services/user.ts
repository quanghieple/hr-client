import { CLEAR_NOTICES, GET_ALL_ROLES, GET_CURRENT_USER, GET_NOTICES_LIST, GET_USER } from '@/api/UserApi';
import { User } from '@/data/database';
import request from '@/utils/request';

export async function queryNotices(offset: number = 0, limit: number = 5): Promise<any> {
  return request.get(GET_NOTICES_LIST, {offset: offset, limit: limit});
}

export async function clearNotices(id?: string, type?: string): Promise<any> {
  return request.put(CLEAR_NOTICES, { data: {id, type}});
}

export async function getAllRoles(): Promise<any[]> {
  return request.get(GET_ALL_ROLES)
}

export async function getCurrentUser(): Promise<User> {
  return request.get(GET_CURRENT_USER)
}

export async function getUser(id: string): Promise<User> {
  return request.get(GET_USER + `/${id}`)
}
