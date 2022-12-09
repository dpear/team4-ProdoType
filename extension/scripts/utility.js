//transformed time to seconds for caculation
function calculateTotalSeconds(timer) {
    const { hours, minutes, seconds } = timer;
    return 3600 * hours + 60 * minutes + seconds;
}

//Standarize hour, minuts, seconds and make them displayed in the dom
function elementTime(element, time) {
    const { hours, minutes, seconds } = calculateTime(time)
    element.textContent = `${minutes}:${seconds}`
    if (hours) {
        element.textContent = `${hours}:` + element.textContent
    }
}

//Input: Total Seconds
function calculateTime(time) {
    const hours = parseInt(time / 3600)
    const minutes = addZero(parseInt(parseInt(time % 3600) / 60))
    const seconds = addZero(time - hours * 3600 - minutes * 60)
    return { hours, minutes, seconds }
}

function addZero(time) {
    return (+time < 10 && +time >= 0) ? `0${time}` : time
}

export {calculateTotalSeconds, elementTime}