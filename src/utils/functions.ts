import { formatMessage } from "umi";

const localURL = "http://localhost:5001/hr-sol-289314/us-central1/"

async function parseBody(response: Response) {
    const defaultError = formatMessage({ id: 'error.it.help', defaultMessage: 'Something went wrong. Please contact IT support'})
    const ok = response.ok;
    const status = response.status;
    const body = await response.json()
    console.log(body)
    if (ok) {
        return {body: body, ok: ok, status: status} 
    } else
        return {message: formatMessage({id: body.code || "none", defaultMessage: defaultError}), ok: ok, status: status}
}

export async function get(methodName: string): Promise<any> {
    const response = await fetch(localURL + methodName, {method: 'GET'})
    return parseBody(response)
}

export async function post(methodName: string, requestBody: any): Promise<any> {
    const response = await fetch(localURL + methodName, {method: 'POST', body: JSON.stringify(requestBody)})
    return parseBody(response)
}