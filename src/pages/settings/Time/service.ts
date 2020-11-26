import { LocationCheckIn } from "@/data/database";
import { firebase } from "@/utils/firebase";

export async function getLocations(parent: string | undefined) {
    return (await firebase.database().ref().child(`settings/location/${parent}`).once("value")).val()
}

export async function addLocation(parent: string, locations: Array<LocationCheckIn>) {
    return await firebase.database().ref().child(`settings/location/${parent}`).set(locations)
}
