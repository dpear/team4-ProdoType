import { Pomodoro } from "./pomodoroDao.js";

export class ChromeStorageAdapter {

    constructor(chromeStorageObj = chrome.storage.local) {
        this.localStorage = chromeStorageObj;
    }

    async getPomodoroByTaskID(id) {
        let res = await this.getPomodoroByIDPromise(id)
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    getPomodoroByIDPromise(id) {
        return new Promise((resolve, reject) => {
            this.localStorage.get([id], function (result) {
                if (result == undefined) {
                    reject('Something went wrong with get API!!');
                } else {
                    resolve(result);
                }
            });
        })
    }

    async getTimeConfig(key) {
        let res = await this.getPomodoroByIDPromise(key)
        return res
    }

    async saveTimeConfig(key, val) {
        return new Promise((resolve, reject) => { 
            chrome.storage.local.set({ [key]: val }, function () {
                resolve(console.log(`Saved ${key} Config : ${val} to database`));
            });
        })
    }


    async getAllPomodoros() {
        let res = await this.getAllPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    async getAllPomodorosPromise() {
        return new Promise((resolve, reject) => {
            this.localStorage.get(null, function (result) {
                if (result == undefined) {
                    reject('Something went wrong with get API!!');
                } else {
                    console.log("hahaha");
                    resolve(result);
                }
            });
        })
    }


    async getAllUpcomingPomodoros() {
        let res = await this.getAllUpcomingPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    async getAllUpcomingPomodorosPromise() {
        return new Promise((resolve, reject) => {
            this.localStorage.get(null, function (result) {
                if (result == undefined) {
                    reject('Something went wrong with get API!!');
                } else {
                    resolve(Object.fromEntries(Object.entries(result).filter(([k, v]) => v.is_completed === false)));
                }
            });
        })
    }


    async getAllCompletedPomodoros() {
        let res = await this.getAllCompletedPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes
    }

    async getAllCompletedPomodorosPromise() {
        return new Promise((resolve, reject) => {
            this.localStorage.get(null, function (result) {
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
        this.localStorage.set({ [uid]: pomo }, function () {
            console.log(`Saved a new pomodoro : ${JSON.stringify(pomo)} to database`);
        });
    }

    updatePomodoro(key, pomo_new) {
        console.log(`updating ${key} in the chrome storage!!`);
        this.localStorage.set({ [key]: pomo_new }, function () {
            console.log("Successfully updated pomodoro!");
        });
    }

    deletePomodoro(key) {
        console.log(`Deleting pomodoro against key : ${key}!!`);
        this.localStorage.remove([key], function () {
            console.log("Deleted pomodoro from database");
        });
    }

}