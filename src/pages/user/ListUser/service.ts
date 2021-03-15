import { GET_LIST_USER } from '@/api/UserApi';
import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryRule(params?: TableListParams): Promise<any>  {
  const result = await request.get(GET_LIST_USER)
  return {...params, data: Object.values(result.data), success: true};
}


