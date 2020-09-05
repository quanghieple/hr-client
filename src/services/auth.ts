import { firebase } from '@/utils/firebase';
import { CurrentUser } from '@/models/user';

// var user = firebase.auth().currentUser;

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

export async function saveUser(user: CurrentUser) {
  return firebase.database().ref('users/' + user.userid).set({
    user
  })
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
