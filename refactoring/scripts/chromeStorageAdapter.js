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

export class ChromeStorageAdpater {
    constructor() {
    }

    async getAllPomodoros() {
        let res = await getAllPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    async getAllPomodorosPromise() {
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


    async getAllUpcomingPomodoros() {
        let res = await getAllUpcomingPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    async getAllUpcomingPomodorosPromise() {
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


    async getAllCompletedPomodoros() {
        let res = await getAllCompletedPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes
    }

    async getAllCompletedPomodorosPromise() {
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


    savePomodoro(pomo) {
        const uid = Date.now().toString();
        chrome.storage.local.set({ [uid]: pomo }, function () {
            console.log(`Saved a new pomodoro : ${JSON.stringify(pomo)} to database`);
        });
    }

    updatePomodoro(key, pomo_new) {
        console.log(`updating ${key} in the chrome storage!!`);
        chrome.storage.local.set({ [key]: pomo_new }, function () {
            console.log("Successfully updated pomodoro!");
        });
    }

    deletePomodoro(key) {
        console.log(`Deleting pomodoro against key : ${key}!!`);
        chrome.storage.local.remove([key], function () {
            console.log("Deleted pomodoro from database");
        });
    }
}