import { firebase } from '@/utils/firebase';
import { get, post } from '@/utils/functions'
import { currentUser } from './login';
var storageRef = firebase.storage().ref();

export const getCheckinPath = (userId: string, current: Date) => `check/${current.getFullYear()}/${current.getMonth()}/${userId}`

export function getCurrentShift(uid: string) {
    return firebase.database().ref().child(`checkin/current/${uid}`).once("value")
}

export function QRcheck(body: any) {
    return post("QRCheckIn", body)
}

export function localtionCheck(body: any) {
    return post("locationCheckIn", body)
}

export async function getCurrentMonth() {
    let user = await currentUser()
    return firebase.database().ref().child(getCheckinPath(user.uid, new Date())).once("value")
}

export async function getMonth(month: number, year: number) {
    let user = await currentUser()
    return firebase.database().ref().child(getCheckinPath(user.uid, new Date(year, month))).once("value")
}

export async function uploadMealImage(file: File) {
  let user = await currentUser()
  return storageRef.child("meal/" + user.uid + "/" + new Date().getTime()).put(file)
}


export const writeMealData = async (body: any) => {
  let user = await currentUser();
  console.log(`meals/${user.uid}/${body.id}`, body);
  await firebase.database().ref().child(`meals/${user.uid}/${body.id}`).set(body);
  return {ok: true}
}

export const getListMeal = async () => {
  let user = await currentUser();
  const result = await firebase.database().ref().child("meals/" + user.uid).once("value")
  return result.val() || {};
}

export const writeTracking = async (body: any) => {
  const current = new Date();
  let user = await currentUser();
  await firebase.database().ref().child(`tracking/${user.uid}/${current.getFullYear()}/${current.getMonth()}/${current.getDate()}/${current.getTime()}`).set({...body.tracking, time: current.getTime()});
  return {ok: true}
}

export const getTodayTracking = async () => {
  const current = new Date();
  let user = await currentUser();
  const val = await firebase.database().ref().child(`tracking/${user.uid}/${current.getFullYear()}/${current.getMonth()}/${current.getDate()}`).once("value");
  return val.val() || {};
}

export const getTrackingThisMonth = async (month: number, year: number) => {
  let user = await currentUser();
  const val = await firebase.database().ref().child(`tracking/${user.uid}/${year}/${month}`).once("value");
  console.log(val.val() || {})
  return val.val() || {};
}
