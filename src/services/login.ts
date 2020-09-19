import request from '@/utils/request';
import { firebase } from '@/utils/firebase';

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
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function registerUser(user: any) {
  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() =>
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.userName, user.password)
        .then((res) => ({
          ...res,
          ok: true,
        }))
        .catch((error) => ({
          ...error,
          ok: false,
        })),
    )
    .catch(/* error */);
}

export function currentUser() {
  return firebase.auth().currentUser
}

export async function getCurrentRole() {
  let user = currentUser();
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

export async function signInUser(email: any) {
  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() =>
      firebase
        .auth()
        .signInWithEmailAndPassword(email.userName, email.password)
        .then((res) => ({
          ...res,
          ok: true,
        }))
        .catch((error) => ({
          ...error,
          ok: false,
        })),
    )
    .catch(/* error */);
}

export async function signOutUser() {
  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() =>
      firebase
        .auth()
        .signOut()
        .then((res) => ({
          res,
          ok: true,
        }))
        .catch((error) => ({
          error,
          ok: false,
        })),
    )
    .catch(/* error */);
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
