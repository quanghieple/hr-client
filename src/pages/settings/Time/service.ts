import { LocationCheckIn } from "@/data/database";
import { firebase } from "@/utils/firebase";

export async function getLocations(parent: number | undefined) {
    return (await firebase.database().ref().child(`settings/location/${parent}`).once("value")).val()
}

export async function addLocation(parent: number, locations: Array<LocationCheckIn>) {
    return await firebase.database().ref().child(`settings/location/${parent}`).set(locations)
}
