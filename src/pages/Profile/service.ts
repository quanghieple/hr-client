import { UPDATE_CURRENT, UPDATE_USER } from '@/api/UserApi';
import { User } from '@/data/database';
import { currentUser, getProfile } from '@/services/login';
import { getAuthority } from '@/utils/authority';
import * as functions from '@/utils/functions';
import request from '@/utils/request';

export async function queryCurrent(): Promise<any> {
  let user = await currentUser();
  return getProfile(user.uid);
}

export async function queryUser(id: string): Promise<any> {
  return functions.post("getUserById", {id: id})
}

export function updateCurrentUser(update: User) {
  return request.put(UPDATE_CURRENT, {data: update});
}

export function updateUser(update: User) {
  return request.put(UPDATE_USER + `/${update.id}`, {data: update})
}

export async function getUserForUpdate(): Promise<User>{
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
