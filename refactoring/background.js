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
    console.log(element)
    console.log("Current globaltime is ", time)
    element.textContent = `${minutes}:${seconds}`
    if (hours) {
        element.textContent = `${hours}:` + element.textContent
    }
}

let temp = 0

let handler = null 
let globalTime = null
let lastFocusTab = -1
let lastBtnState = -1
let curTaskId = null
let curTaskTitle = ""
let curPomoExpected = -1
let curPomoCompleted = -1
let curTaskInfo = null
let lastTaskListTab = 0
let audioPath = "/src/sounds/car"
let audio = null
let curTime = "globalTime"
let popupOpenMsg = "popup_opened"

function start(index, element, time) {
    if (time) {
        globalTime = time
        handler = setInterval(() => {
            globalTime--
            chrome.storage.local.set({
                [curTime]: globalTime 
              });
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.msg == popupOpenMsg) {
                    let window = chrome.extension.getViews({type: "popup"});
                    if (window.length != 0) {
                        element = window[0].document.querySelectorAll(".time")[index];
                    }
                    // If popup closed when timer gets 0, button won't show complete 
                    // Thus, we need to notifyComplete again upon popup relaunch 
                    if (globalTime == 0) {
                        notifyComplete(index);
                    }
                }
              });
            elementTime(element, globalTime)
            if (globalTime <= 0) {
                clearInterval(handler)
                lastBtnState = 2;
                notifyComplete(index);
                let audioIdx = index + 1
                audio = new Audio(audioPath + audioIdx + ".wav");
                audio.play();
                return;
            }
        }, 1000)
    } else {
        notifyComplete(index);
        lastBtnState = 2;
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

function getFocusTabIdx() {
    return lastFocusTab
}

function setFocusTabIdx(idx) {
    lastFocusTab = idx
}

function getBtnStateIdx() {
    return lastBtnState
}

function setBtnStateIdx(idx) {
    lastBtnState = idx
}

function getTaskId() {
    return curTaskId
}

function setTaskId(id) {
    curTaskId = id
}

function getTaskTitle() {
    return curTaskTitle
}

function setTaskTitle(title) {
    curTaskTitle = title
}

function getPomoExpected() {
    return curPomoExpected
}

function setPomoExpected(num) {
    curPomoExpected = num
}

function getPomoCompleted() {
    return curPomoCompleted
}

function setPomoCompleted(num) {
    curPomoCompleted = num
}

function getTaskInfo() {
    return curTaskInfo
}

function setTaskInfo(obj) {
    curTaskInfo = obj
}

function getTaskListTab() {
    return lastTaskListTab
}

function setTaskListTab(idx) {
    lastTaskListTab = idx
}

function increaseTemp() {
    temp += 1
    return temp
}


chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
  });