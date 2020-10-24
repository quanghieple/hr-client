import * as functions from '@/utils/functions';
import { TableListParams } from './data.d';

export async function queryRule(params?: TableListParams): Promise<any>  {
  const result = await functions.get("listUser")
  return {...params, data: Object.values(result.body), success: true};
}


