import request from '@/utils/request';
import { currentUser, getProfile } from './login';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await currentUser()
      let profile = (await getProfile(user.uid)).val();
      resolve({
        ok: true,
        user: {
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          providerId: user.providerId,
          uid: user.uid,
          parent: profile.parent
        }
      })
    } catch (err) {
      resolve({ok: false})
    }
  })
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
