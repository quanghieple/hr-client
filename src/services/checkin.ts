import { GET_CURRENT_SHIFT, GET_HISTORY, GET_SHIFT_LIST, LOCATION_CHECK, QR_CHECK } from '@/api/CheckinApi';
import { GET_PARENT_SETTING, GET_SETTING } from '@/api/UserApi';
import { firebase } from '@/utils/firebase';
import request from '@/utils/request';

export const getCheckinPath = (userId: number, current: Date) => `check/${current.getFullYear()}/${current.getMonth()}/${userId}`

export function getCurrentShift() {
  return request.get(GET_CURRENT_SHIFT)
}

export function QRcheck(body: any) {
  return request.post(QR_CHECK, {data: body})
}

export function localtionCheck(body: any) {
  return request.post(LOCATION_CHECK, {data: body})

}

export function getListShift() {
  return request.get(GET_SHIFT_LIST)
}

export async function getSetting(): Promise<any> {
  return request.get(GET_SETTING)
}

export async function getParentSetting(): Promise<any> {
  return request.get(GET_PARENT_SETTING)
}

export async function getCurrentMonth() {
  const date = new Date()
  return request.get(`${GET_HISTORY}?month=${date.getMonth()}-${date.getFullYear()}`)
}

export async function getMonth(month: number, year: number) {
  return firebase.database().ref().child(getCheckinPath(1, new Date(year, month))).once("value")
}
