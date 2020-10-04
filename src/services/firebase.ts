import { CurrentUser } from "@/pages/Profile/data";
import { firebase } from "@/utils/firebase";
import { formatMessage } from "umi";

var storageRef = firebase.storage().ref();

function withFirebase(f: Function) {
    try {
        return {...f.call, ok: true}
    } catch (err) {
        const defaultError = formatMessage({ id: 'error.it.help', defaultMessage: 'Something went wrong. Please contact IT support'})
        return {ok: false, message: formatMessage({id: err.code || "", defaultMessage: defaultError})}
    }
}

export function getToken(): Promise<string> {
    return firebase.auth().currentUser.getIdToken(false)
}

export function uploadProfileImage(file: File, filename: string) {
    return storageRef.child("profiles/" + filename).put(file)
}

export async function updateProfile(update: CurrentUser) {
    try {
        let user = {};
        let currentUser = firebase.auth().currentUser; 
        if (update.displayName) {
            user["displayName"] = update.displayName
            delete update.displayName;
        }
        if(update.photoURL) {            
            user["photoURL"] = update.photoURL
        }

        if (user != {}) {
            await currentUser?.updateProfile(user)
        }
        if(update != {}) {
            await firebase.database().ref().child("profiles/" + currentUser?.uid).set(update)
        }

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