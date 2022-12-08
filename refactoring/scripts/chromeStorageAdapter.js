import { Pomodoro } from "./pomodoroDao.js";

// /**
//  * Start of testing code
//  */
// const testing_button = document.getElementById("db-testing")

// const pomo = new Pomodoro('title', 4, '2022-12-04', 'tags', 'notes', false);

// testing_button.addEventListener("click", () => {
//     getAllPomodoros();
//     // getAllUpcomingPomodoros();
//     // updatePomodoro(uid, pomo_new);
//     // getAllCompletedPomodoros();
//     // deletePomodoro(uid);
//     // getAllPomodoros();
// }
// );

// /**
//  * End of testing code
//  *
//  */

export async function getPomodoroByTaskID(id) {
    let res = await getPomodoroByIDPromise(id)
    var receivedRes = JSON.parse(JSON.stringify(res))
    return receivedRes;
}

export async function getTimeConfig(key) {
    let res = await getPomodoroByIDPromise(key)
    return res
}

async function getPomodoroByIDPromise(id) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([id], function (result) {
            if (result == undefined) {
                reject('Something went wrong with get API!!');
            } else {
                resolve(result);
            }
        });
    })
}


export async function getAllPomodoros() {
    let res = await getAllPomodorosPromise()
    var receivedRes = JSON.parse(JSON.stringify(res))
    return receivedRes;
}

async function getAllPomodorosPromise() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function (result) {
            if (result == undefined) {
                reject('Something went wrong with get API!!');
            } else {
                resolve(result);
            }
        });
    })
}


export async function getAllUpcomingPomodoros() {
    let res = await getAllUpcomingPomodorosPromise()
    var receivedRes = JSON.parse(JSON.stringify(res))
    return receivedRes;
}

async function getAllUpcomingPomodorosPromise() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function (result) {
            if (result == undefined) {
                reject('Something went wrong with get API!!');
            } else {
                resolve(Object.fromEntries(Object.entries(result).filter(([k, v]) => v.is_completed === false)));
            }
        });
    })
}


export async function getAllCompletedPomodoros() {
    let res = await getAllCompletedPomodorosPromise()
    var receivedRes = JSON.parse(JSON.stringify(res))
    return receivedRes
}

async function getAllCompletedPomodorosPromise() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function (result) {
            if (result == undefined) {
                reject('SOmething went wrong with get API!!');
            } else {
                resolve(Object.fromEntries(Object.entries(result).filter(([k, v]) => v.is_completed === true)));
            }
        });
    })
}


export function savePomodoro(pomo) {
    const uid = Date.now().toString();
    chrome.storage.local.set({ [uid]: pomo }, function () {
        console.log(`Saved a new pomodoro : ${JSON.stringify(pomo)} to database`);
    });
}

export async function saveTimeConfig(key, val) {
    return new Promise((resolve, reject) => { 
        chrome.storage.local.set({ [key]: val }, function () {
            resolve(console.log(`Saved ${key} Config : ${val} to database`));
        });
    })
}

export function updatePomodoro(key, pomo_new) {
    console.log(`updating ${key} in the chrome storage!!`);
    chrome.storage.local.set({ [key]: pomo_new }, function () {
        console.log("Successfully updated pomodoro!");
    });
}

export function deletePomodoro(key) {
    console.log(`Deleting pomodoro against key : ${key}!!`);
    chrome.storage.local.remove([key], function () {
        console.log("Deleted pomodoro from database");
    });
}
