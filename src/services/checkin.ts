import { GET_CURRENT_SHIFT, GET_HISTORY, GET_SHIFT_LIST, LOCATION_CHECK, QR_CHECK, UPDATE_SHIFT } from '@/api/CheckinApi';
import { GET_PARENT_SETTING, GET_SETTING } from '@/api/UserApi';
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
  return getMonth(date.getMonth(), date.getFullYear())
}

export async function getMonth(month: number, year: number) {
  return request.get(`${GET_HISTORY}?month=${month}-${year}`)
}

export function updateShift(body: any): Promise<any> {
  return request.post(UPDATE_SHIFT, { data: body })
}
