import request from '@/utils/request';
import { firebase } from '@/utils/firebase';
import * as functions from '@/utils/functions';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export enum Role {
  guest = "guest",
  user = "user",
  admin = "admin"
}

export async function getFakeCaptcha(mobile: string) {
  return request.get(`/api/login/captcha?mobile=${mobile}`);
}

export async function registerUser(newUser: any) {
  return functions.post("addAuthenUser", {user : newUser});
}

export async function currentUser(): Promise<firebase.User>{
  return request.get('/users/me')
}

export async function getProfile(userId: string){
  return firebase.database().ref('/profiles/' + userId).once('value')
}

export async function getCurrentRole() {
  let user = await currentUser();
  let role = Role.guest;
  if (user != null) {
    let idTokenResult = await user.getIdTokenResult()
    if (!!idTokenResult.claims.admin) {
      role = Role.admin;
    } else {
      role = Role.user;
    }
  }

  return role;
}

export async function signInUser(user: any) {
  return request.post('/login', {data: {username: user.userName, password: user.password}})
}

export async function signOutUser() {
  return true;
}

export async function checkLoginState() {
  // eslint-disable-next-line compat/compat
  return new Promise<any>((resolve , reject ) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve({
          ...user,
          login: true,
        });
      } else {
        resolve({
          login: false,
        });
      }
    });
  });
}
