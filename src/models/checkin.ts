import { getCurrentMonth } from "@/services/checkin";
import { Effect, Reducer } from "umi";

export interface CheckinModelState {
    history: Array<any>
}

export interface CheckinModelType {
    namespace: 'checkin';
    state: CheckinModelState;
    effects: {
        fetchHistory: Effect;
    }
    reducers: {
        saveHistory: Reducer<CheckinModelState>
    }
}

const CheckinModel: CheckinModelType = {
    namespace: 'checkin',
    state: {
        history: [],
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
        }
    },
    reducers: {
        saveHistory(state, action) {
            return {
                ...state,
                history: action.payload || []
            }
        }
    }
}

export default CheckinModel
