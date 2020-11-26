import { CurrentUser, GeographicItemType } from './data.d';

export interface ModalState {
  currentUser?: Partial<CurrentUser>;
  province?: GeographicItemType[];
  city?: GeographicItemType[];
  isLoading?: boolean;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
  };
  reducers: {
  };
}

const Model: ModelType = {
  namespace: 'settingsAndTime',

  state: {
    currentUser: {},
    province: [],
    city: [],
    isLoading: false,
  },

  effects: {},

  reducers: {},
};

export default Model;
