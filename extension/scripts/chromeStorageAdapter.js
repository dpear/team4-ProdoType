import { Pomodoro } from "./pomodoroDao.js";

/**
 * This is the interface to interact with chrome local storage.
 */

export class ChromeStorageAdapter {

    constructor(chromeStorageObj = chrome.storage.local) {
        this.localStorage = chromeStorageObj;
    }

    /**
    * getPomodoroByTaskID returns details for any pomodoro stored in DB.
    * The method takes task/pomodoro id as an argument and return a dict object. 
    * 
    * Inside the implemetation, this method calls {@link getPomodoroByIDPromise}.
    * 
    * @param {string} id - Task ID
    * @returns {Map} taskDetails - An dictionary containing details of the task.
    */

    async getPomodoroByTaskID(id) {
        let res = await this.getPomodoroByIDPromise(id)
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    /**
    * getPomodoroByIDPromise returns a promise for any pomodoro stored in DB.
    * The method takes task/pomodoro id as an argument and returns a promise. 
    * 
    * This method actually calls chrome storage API and resolve/rejects the promise returned.
    * 
    * @param {string} id - Task ID
    * @returns {Promise} promise - A promise for pomodor details .
    */

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

    /**
    * getTimeConfig returns user setting for pomodoro extensions.
    * The settings provided to user are configuation of time 
    *   -- to focus
    *   -- short break
    *   -- long break
    * 
    * This method takes the screen id and fetches user setting for it.
    * 
    * @param {string} key - Screen ID
    * @returns {Number} time - time configured for screen.
    */

    async getTimeConfig(key) {
        let res = await this.getPomodoroByIDPromise(key)
        return res
    }

    /**
    * saveTimeConfig saves user setting for pomodoro extensions.
    * The settings provided to user are configuation of time 
    *   -- to focus
    *   -- short break
    *   -- long break
    * 
    * This method takes the screen id and respective user time setting value.
    * 
    * @param {string} key - Screen ID
    * @returns {Number} val - time configured for screen.
    */

    async saveTimeConfig(key, val) {
        return new Promise((resolve, reject) => { 
            chrome.storage.local.set({ [key]: val }, function () {
                resolve(console.log(`Saved ${key} Config : ${val} to database`));
            });
        })
    }


    /**
    * getAllPomodoros returns dictionary object containig details for any pomodoro stored in DB.
    *  
    * Inside the implemetation, this method calls {@link getAllPomodorosPromise}.
    * 
    * @returns {Map} taskDetails - An dictionary containing details of all the tasks in DB.
    */

    async getAllPomodoros() {
        let res = await this.getAllPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    
    /**
    * getAllPomodorosPromise returns a promise for all pomodoros stored in DB.
    * The method takes nothing as an argument and returns a promise. 
    * 
    * This method actually calls chrome storage API and resolve/rejects the promise returned.
    * 
    * @returns {Promise} promise - A promise for all upcoming and completed pomodor details .
    */

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


    /**
    * getAllPomodoros returns dictionary object containig details for any pomodoro stored in DB.
    *  
    * Inside the implemetation, this method calls {@link getAllPomodorosPromise}.
    * 
    * @returns {Map} taskDetails - An dictionary containing details of all the tasks in DB.
    */

    async getAllUpcomingPomodoros() {
        let res = await this.getAllUpcomingPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes;
    }

    /**
    * getAllUpcomingPomodorosPromise returns a promise for only upcoming pomodoros stored in DB.
    * The method takes nothing as an argument and returns a promise. 
    * 
    * This method actually calls chrome storage API and resolve/rejects the promise returned.
    * 
    * If the promise resolves to some data, filter based on is_completed flag for each pomodoro returned.
    * 
    * @returns {Promise} promise - A promise for only upcoming pomodor details .
    */

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


    /**
    * getAllCompletedPomodoros returns dictionary object containig details for all completed pomodoros stored in DB.
    *  
    * Inside the implemetation, this method calls {@link getAllCompletedPomodorosPromise}.
    * 
    * @returns {Map} taskDetails - An dictionary containing details of only completed tasks in DB.
    */

    async getAllCompletedPomodoros() {
        let res = await this.getAllCompletedPomodorosPromise()
        var receivedRes = JSON.parse(JSON.stringify(res))
        return receivedRes
    }


    /**
    * getAllCompletedPomodorosPromise returns a promise for only completed pomodoros stored in DB.
    * The method takes nothing as an argument and returns a promise. 
    * 
    * This method actually calls chrome storage API and resolve/rejects the promise returned.
    * 
    * If the promise resolves to some data, filter based on is_completed flag for each pomodoro returned.
    * 
    * @returns {Promise} promise - A promise for only completed pomodor details .
    */

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

    /**
    * savePomodoro stores a pomodoro created by user as an upcoming task.
    *  The set functionality from chrome storage is async but because user creates one task at a time 
    *  we are fine with this implementation and do not need to wait to it to resolve.
    * 
    * @param {Pomodoro} pomo - A {@link Pomodoro} object containing all details for user task. 
    * 
    * @returns {Promise} promise - A promise regrading the save function from local storage.
    */

    savePomodoro(pomo) {
        const uid = Date.now().toString();
        this.localStorage.set({ [uid]: pomo }, function () {
            console.log(`Saved a new pomodoro : ${JSON.stringify(pomo)} to database`);
        });
    }


    /**
    * updatePomodoro updates a pomodoro created by user a completed task.
    *  The set functionality from chrome storage is async but because we update one task at a time 
    *  we are fine with this implementation and do not need to wait for to it to resolve.
    * 
    * @param {string} key - TaskID
    * @param {Pomodoro} pomo - A {@link Pomodoro} object containing new details for respective task ID. 
    * 
    * @returns {Promise} promise - A promise regrading the update function from local storage.
    */

    updatePomodoro(key, pomo_new) {
        console.log(`updating ${key} in the chrome storage!!`);
        this.localStorage.set({ [key]: pomo_new }, function () {
            console.log("Successfully updated pomodoro!");
        });
    }

    /**
    * deletePomodoro removes a pomodoro created by user from DB.
    *  The remove functionality from chrome storage is async but because user deletes one task at a time 
    *  we are fine with this implementation and do not need to wait to it to resolve.
    * 
    * @param {string} key - TaskID. 
    * 
    * @returns {Promise} promise - A promise regrading the remove function from local storage.
    */
    deletePomodoro(key) {
        console.log(`Deleting pomodoro against key : ${key}!!`);
        this.localStorage.remove([key], function () {
            console.log("Deleted pomodoro from database");
        });
    }

}