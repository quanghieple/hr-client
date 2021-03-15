import { GET_ALL_ROLES, GET_CURRENT_USER, GET_USER } from '@/api/UserApi';
import { User } from '@/data/database';
import request from '@/utils/request';

export async function queryNotices(): Promise<any> {
  return request.get('/api/notices');
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
