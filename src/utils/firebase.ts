import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import config from '../../config/firebase';

export { firebase };
export const firebaseApp = firebase.initializeApp(config);