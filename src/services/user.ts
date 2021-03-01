import request from '@/utils/request';
import { currentUser} from './login';

export async function queryCurrent(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await currentUser()
      resolve(user)
    } catch (err) {
      resolve(undefined)
    }
  })
}

export async function queryNotices(): Promise<any> {
  return request.get('/api/notices');
}
