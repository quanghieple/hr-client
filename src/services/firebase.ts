import { User } from "@/data/database";
import { firebase } from "@/utils/firebase";
import { formatMessage } from "umi";

var storageRef = firebase.storage().ref();

export async function getToken(): Promise<string> {
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
        return await currentUser.getIdToken(false)
    } else
        return "none"
}

export function uploadProfileImage(file: File, filename: string) {
    return storageRef.child("profiles/" + filename).put(file)
}

export async function updateProfile(update: User) {
    try {
        let user = {};
        let currentUser = firebase.auth().currentUser;
        if (update.displayName) {
            user["displayName"] = update.displayName
        }
        if(update.photoURL) {
            user["photoURL"] = update.photoURL
        }

        if (user != {}) {
            await currentUser?.updateProfile(user)
        }
        await firebase.database().ref().child("profiles/" + currentUser?.uid).set(update)

        return {ok: true}
    } catch (err) {
        console.log(err)
        const defaultError = formatMessage({ id: 'error.it.help', defaultMessage: 'Something went wrong. Please contact IT support'})
        return {ok: false, message: formatMessage({id: err.code || "", defaultMessage: defaultError})}
    }
}

export function getDownloadUrl(filename: string) {
    return storageRef.child(filename).getDownloadURL()
}
