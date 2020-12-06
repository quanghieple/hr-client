function parseDiff (difference: number, withS: boolean) {
    let left = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
    };

    return `${left.hours}h:${left.minutes}m` + (withS ? `:${left.seconds}s` : "") 
}

export function timeDiff(time1: number, time2: number, withS: boolean = false) {
    let difference = Math.abs(time2 - time1)
    return parseDiff(difference, withS)
}

export function currentDiff(time: number, withS: boolean = false) {
    let difference = Math.abs(time - (new Date()).getTime())
    return parseDiff(difference, withS)
}

export function formatTime(time: number) {
    let date = new Date(time)
    return `${date.getHours()}h:${date.getMinutes()}m:${date.getSeconds()}s`
}