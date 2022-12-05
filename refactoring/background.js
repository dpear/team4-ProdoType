// temporarily duplicate these functions here - dev
function addZero(time) {
    return (+time < 10 && +time >= 0) ? `0${time}` : time
}
//Input: Total Seconds
function calculateTime(time) {
    const hours = parseInt(time / 3600)
    const minutes = addZero(parseInt(parseInt(time % 3600) / 60))
    const seconds = addZero(time - hours * 3600 - minutes * 60)
    return { hours, minutes, seconds }
}
function elementTime(element, time) {
    const { hours, minutes, seconds } = calculateTime(time)
    element.textContent = `${minutes}:${seconds}`
    if (hours) {
        element.textContent = `${hours}:` + element.textContent
    }
}

let handler = null 
let globalTime = null
let audioPath = "/src/sounds/car"
let audio = null

function start(index, element, time) {
    if (time) {
        globalTime = time
        handler = setInterval(() => {
            globalTime--
            elementTime(element, --time) 
            if (time <= 0) {
                clearInterval(handler)
                notifyComplete(index);
                let audioIdx = index + 1
                audio = new Audio(audioPath + audioIdx + ".wav");
                audio.play();
            }
        }, 1000)
    } else {
        notifyComplete(index);
        audio.play();
    }
}

function notifyComplete(index) {
    chrome.runtime.sendMessage({
        msg: "timer_completion",
        data: {
            content: index
        }
    });
}

function interrupt() {
    clearInterval(handler)
}

function getGlobalTime() {
    return globalTime
}

function setGlobalTime(time) {
    globalTime = time
}
