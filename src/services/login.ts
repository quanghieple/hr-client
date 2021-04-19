import request from '@/utils/request';
import { CREATE_USER } from '@/api/UserApi';

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
  return request.post(CREATE_USER, {data : newUser});
}

export async function signInUser(user: any) {
  return request.post('/login', {data: {username: user.userName, password: user.password}})
}

export async function signOutUser() {
  return true;
}
