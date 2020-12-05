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
            let snap = yield call(getCurrentMonth)
            yield put({
                type: 'saveHistory',
                payload: snap.val()
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