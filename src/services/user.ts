import request from '@/utils/request';
import { currentUser } from './login';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let user = await currentUser()
    console.log("user", user)
    if (user != null) {
      resolve(user.providerData[0])
    } else {
      resolve({})
    }
  })
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
