import { firebase } from '@/utils/firebase';
import { post } from '@/utils/functions'
import { currentUser } from './login';

export const getCheckinPath = (userId: number, current: Date) => `check/${current.getFullYear()}/${current.getMonth()}/${userId}`

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
    return firebase.database().ref().child(getCheckinPath(user.id, new Date())).once("value")
}

export async function getMonth(month: number, year: number) {
    let user = await currentUser()
    return firebase.database().ref().child(getCheckinPath(user.id, new Date(year, month))).once("value")
}
