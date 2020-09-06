import request from '@/utils/request';
import { firebase } from '@/utils/firebase';
import { checkLoginState } from './auth';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return new Promise((resolve, reject) => {
    checkLoginState().then((user) => {
      if(!user.login) {
        resolve({login: false, message: "User is not login in"})
      }

      console.log(user);
      var userId = user.uid
      return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        resolve({login: true, ...snapshot.val().user});
      }).catch((err) => {
        resolve({login: false, ...err})
      });
    })
  })
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
