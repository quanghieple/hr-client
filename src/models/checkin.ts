import { getCurrentMonth, getListShift } from "@/services/checkin";
import { Effect, Reducer } from "umi";

export interface CheckinModelState {
    history? : Array<any>;
    shifts?: any;
}

export interface CheckinModelType {
    namespace: 'checkin';
    state: CheckinModelState;
    effects: {
        fetchHistory: Effect;
        fetchShifts: Effect;
    }
    reducers: {
        saveHistory: Reducer<CheckinModelState>;
        saveShifts: Reducer<CheckinModelState>;
    }
}

const CheckinModel: CheckinModelType = {
    namespace: 'checkin',
    state: {
        history: [],
        shifts: {}
    },
    effects: {
      *fetchHistory(_, {call, put}) {
        let res = yield call(getCurrentMonth)
        var history = {}
        res.forEach((item: any) => {
          const key: string = "d" + item.date
          if (history[key])
            history[key] = [...history[key], item]
          else
            history[key] = [item]
        })
        yield put({
            type: 'saveHistory',
            payload: history
        })
      },
      *fetchShifts(_, { call, put }) {
        const res = yield getListShift();
        const shifts = res.reduce((map : any, item : any) => {
          return {...map, [item.id]: item}
        }, {})
        yield put({
          type: 'saveShifts',
          payload: shifts
        })
      }
    },
    reducers: {
      saveHistory(state, action) {
        return {
          ...state,
          history: action.payload || []
        }
      },
      saveShifts(state, action) {
        return {
          ...state,
          shifts: action.payload
        }
      }
    }
}

export default CheckinModel
