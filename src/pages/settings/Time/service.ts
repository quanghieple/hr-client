import { GET_SETTING, SET_LOCATION } from "@/api/UserApi";
import { LocationCheckIn } from "@/data/database";
import request from "@/utils/request";

export async function getSetting(): Promise<any> {
    return request.get(GET_SETTING)
}

export async function addLocation(locations: Array<LocationCheckIn>) {
    return request.put(SET_LOCATION, {data: locations})
}
