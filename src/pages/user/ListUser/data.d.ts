import { CurrentUser } from "@/data/database";

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: CurrentUser[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  disabled?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  uid?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
