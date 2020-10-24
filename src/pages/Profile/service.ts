import { CurrentUser } from '@/data/database';
import { updateProfile } from '@/services/firebase';
import { currentUser, getProfile } from '@/services/login';
import { getAuthority } from '@/utils/authority';
import * as functions from '@/utils/functions';
import request from 'umi-request';

export async function queryCurrent(): Promise<any> {
  let user = await currentUser();
  return getProfile(user.uid);
}

export async function queryUser(id: string): Promise<any> {
  return functions.post("getUserById", {id: id})
}

export function updateCurrentUser(update: any) {
  return updateProfile(update);
}

export function updateUser(update: any) {
  return functions.post("updateAuthenUser", {user: update})
}

export async function query() {
  return request('/api/users');
}

export async function getUserForUpdate(): Promise<CurrentUser>{
  const search = window.location.search.substring(1);
  const params = new URLSearchParams(search); 
  const id = params.get('id');
  const isAdmin = getAuthority().includes("admin")
  if (id && isAdmin) {
    let query = await queryUser(id);
    return query.ok ? query.body : {};
  } else {
    let query = await queryCurrent(); 
    return query.val();
  }
}
