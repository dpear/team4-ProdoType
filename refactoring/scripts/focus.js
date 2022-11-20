import { timer } from "../src/data/db.js";
console.log(timer)

const ACTIVE = 'active'

//pomodoro's tabs
const focusTabs = document.querySelectorAll('[data-tab-target]')
//pomodoro's contents:focus-time, short-break, long-rest
const focusTabContent = document.querySelectorAll('[data-tab-content]')
const timeShow = document.querySelectorAll('.time')
//pomodoro's three contents' buttions
const startBtn = document.querySelectorAll('.start')
const playBtns = document.querySelectorAll('#action-play')
console.log(playBtns)
const pauseBtns = document.querySelectorAll('#action-pause')
const resetBtn = document.querySelectorAll('.reset')
const pomoNumberCompleted = document.getElementById('pomo-completed')
const pomoNumberExpected = document.getElementById('pomo-expected')

const audios = []

let handle
let pause
let globalTime
let pomoAmountExpected = 8
let pomoCompleted = 0
// let globalTime = calculateTotalSeconds(timer[0])

//Beep sound for pomodoro when complete one, there are three diffirent audios stored in the src, the three audiso correspond to three content's completed remind sound(focus, short break, long break). 
timer.forEach(element => {
    const audio = new Audio(`../src/sounds/${element.sound}`)
    audio.loop = true
    audios.push(audio)
})

//same logic as mainTabs
focusTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        focusTabContent.forEach(content => {
            content.classList.remove(ACTIVE)
        })
        focusTabs.forEach(tab => {
            tab.classList.remove(ACTIVE)
        })
        tab.classList.toggle(ACTIVE)
        const target = document.querySelector(tab.dataset.tabTarget)
        target.classList.toggle(ACTIVE)
        globalTime = calculateTotalSeconds(timer[index])
        elementTime(timeShow[index], globalTime)
    })
    if(tab.classList.contains(ACTIVE)) {
        globalTime = calculateTotalSeconds(timer[index])
        console.log(tab.dataset.tabTarget)
        if(tab.dataset.tabTarget == "#focus-time") {
            pomoNumberExpected.innerHTML = String(pomoAmountExpected)
            pomoNumberCompleted.innerHTML = String(pomoCompleted)
        }
    }
})

//get the timer configuration from imported timer, the length for focus, short break and long-break
timeShow.forEach((element, index) => {
    const totalTime = calculateTotalSeconds(timer[index])
    elementTime(element, totalTime)
})

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

/*
Set Click listener for start button, the original text displayed is "Start"
When clicked the button:
1. pause and set related audio's time
2. toggle the button's active status: active -> inactive, inactive->active
3. determine whether it is currently active and set the value to inActive
4. change buttion's text
5. according to active status, trigger differnt logic
if active: call "start" to start pomodoro timer and countdown
if inactive -> that means previously the pomodoro is active, we want to break that one thus making it inactive: clear previous timer and set the timer to default. 
*/
startBtn.forEach((element, index) => {
    // element.textContent = "Start"
    showPlay(index)
    // let handle
    element.addEventListener('click', () => {
        audios[index].pause()
        audios[index].currentTime = 0;
        if (globalTime == 0) {
            globalTime = calculateTotalSeconds(timer[index])
            elementTime(timeShow[index], globalTime)
            pomoCompleted += 1
            pomoNumberCompleted.innerHTML = String(pomoCompleted)
        }
        element.classList.toggle(ACTIVE)
        const isActive = element.classList.contains(ACTIVE)
        if (isActive) {
            showPause(index)
        } else {
            showPlay(index)
        }
        // element.textContent = isActive ? "Pause" : "Start"
        if (isActive) {
            // handle = start(index, timeShow[index],
            //     calculateTotalSeconds(timer[index]))
            handle = start(index, timeShow[index],
                globalTime)
        } else {
            //pause
            pause = true
            clearInterval(handle)
            // const totalTime = calculateTotalSeconds(timer[index])
            // elementTime(timeShow[index], totalTime)
            // const restTime = calculateTotalSeconds(globalTime)
            elementTime(timeShow[index], globalTime)
        }
    })
})

function showPlay(index) {
    playBtns[index].style.display = 'block'
    pauseBtns[index].style.display = 'none'
}

function showPause(index) {
    playBtns[index].style.display = 'none'
    pauseBtns[index].style.display = 'block'
}


/*
Timer logic:
Input: button index, element dom, time to countdown
Using setInterval to decrease time every second and use "elementTime" to display that changes
If time < 0, that means time is up and should play reminder audio
*/
function start(index, element, time) {
    let handle = null
    if (time) {
        handle = setInterval(() => {
            elementTime(element, --time)
            --globalTime
            if (time <= 0) {
                clearInterval(handle)
                startBtn[index].textContent = "Completed"
                audios[index].play()
            }
        }, 1000)
    } else {
        startBtn[index].textContent = "Completed"
        audios[index].play()
    }
    return handle
}

resetBtn.forEach((element, index) => {
    element.addEventListener('click', () => {
        clearInterval(handle)
        globalTime = calculateTotalSeconds(timer[index])
        elementTime(timeShow[index], globalTime)
        const isActive = startBtn[index].classList.contains(ACTIVE)
        if(isActive) {
            startBtn[index].classList.remove(ACTIVE)
        }
        startBtn[index].textContent = "Start"
    })
})