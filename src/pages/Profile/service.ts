import { UPDATE_CURRENT, UPDATE_USER } from '@/api/UserApi';
import { User } from '@/data/database';
import { getCurrentUser, getUser } from '@/services/user';
import { getAuthority } from '@/utils/authority';
import request from '@/utils/request';

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
    return getUser(id);
  } else {
    return getCurrentUser();
  }
}
