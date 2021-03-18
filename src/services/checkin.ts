import { firebase } from '@/utils/firebase';
import { post } from '@/utils/functions'

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
    return firebase.database().ref().child(getCheckinPath(1, new Date())).once("value")
}

export async function getMonth(month: number, year: number) {
    return firebase.database().ref().child(getCheckinPath(1, new Date(year, month))).once("value")
}
