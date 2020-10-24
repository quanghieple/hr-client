import request from 'umi-request';

export async function queryProvince() {
  return request('https://vapi.vnappmob.com/api/province');
}

export async function queryCity(province: string) {
  return request(`https://vapi.vnappmob.com/api/province/district/${province}`);
}
