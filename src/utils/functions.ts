import { formatMessage } from "umi";

const localURL = "http://localhost:5001/hr-sol-289314/us-central1/"

export async function get(methodName: string): Promise<any> {
    return fetch(localURL + methodName, {method: 'GET'})
}

export async function post(methodName: string, requestBody: any): Promise<any> {
    const defaultError = formatMessage({ id: 'error.it.help', defaultMessage: 'Something went wrong. Please contact IT support'})
    let response = await fetch(localURL + methodName, {method: 'POST', body: JSON.stringify(requestBody)})
    let ok = response.ok;
    let status = response.status;
    let body = await response.json()
    if (ok) {
        return {body: body, ok: ok, status: status} 
    } else
        return {body: {message: formatMessage({id: body.code || "", defaultMessage: defaultError})}, ok: ok, status: status}
}