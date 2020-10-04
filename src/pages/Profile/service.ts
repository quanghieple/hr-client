import { getToken, updateProfile } from '@/services/firebase';
import { currentUser, getProfile } from '@/services/login';
import { post } from '@/utils/functions';
import request from 'umi-request';

export async function queryCurrent(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await currentUser();
      let profile = await getProfile(user.uid);
      resolve(
        {
          ...profile.val(),
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          providerId: user.providerId,
          uid: user.uid
        }
      )
    } catch (err) {
      console.log(err)
      resolve({ok: false})
    }
  })
}

export function saveUpdateUser(user: any) {
  // let token = await getToken();
  // return post("updateAuthenUser", {idToken: token, user: user});
  return updateProfile(user);
}

export async function queryProvince() {
  return request('https://vapi.vnappmob.com/api/province');
}

export async function queryCity(province: string) {
  return request(`https://vapi.vnappmob.com/api/province/district/${province}`);
}

export async function query() {
  return request('/api/users');
}
