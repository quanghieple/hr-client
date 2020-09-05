import request from '@/utils/request';
import { firebase } from '@/utils/firebase';
import { checkLoginState } from './auth';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return new Promise((resolve, reject) => {
    checkLoginState().then((user) => {
      var userId = user.uid
      return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        if(user.login) {
          resolve(snapshot.val().user);
        }
        reject("User is not login in")
      });
    })
  })
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
