import { Pomodoro } from "./pomodoroDao.js";

var uid = Date.now().toString();

/**
 * Start of testing code
 */
const testing_button = document.getElementById("db-testing")

const pomo = new Pomodoro('title', 4, '2022-12-04', 'tags', 'notes', false);

testing_button.addEventListener("click", () => {
    // savePomodoro(pomo);
    // getAllPomodoros();
    getAllUpcomingPomodoros();
    // updatePomodoro(uid, pomo_new);
    // getAllCompletedPomodoros();
    // deletePomodoro(uid);
    // getAllPomodoros();
}
);

/**
 * End of testing code
 * 
 */

function getAllPomodoros() {
    chrome.storage.local.get(null, function (result) {
        let allPomos = result;
        console.log(allPomos);
        return allPomos;
    });
}

function getAllUpcomingPomodoros() {
    chrome.storage.local.get(null, function (result) {
        let upcomingPomos = Object.fromEntries(Object.entries(result).filter(([k,v]) => v.is_completed===false));
        console.log(`got ${upcomingPomos} as upcoming pomos`);
        return upcomingPomos;
    });
}

function getAllCompletedPomodoros() {
    chrome.storage.local.get(null, function (result) {
        let upcomingPomos = Object.fromEntries(Object.entries(result).filter(([k,v]) => v.is_completed===true));
        console.log(`got ${completedPomos} as completed pomos`);
        return completedPomos;
    });
}

function savePomodoro(pomo) {
    chrome.storage.local.set({[uid]:pomo}, function () {
        console.log(`Saved a new pomodoro : ${pomo} to database`);
    });
}

function updatePomodoro(key, pomo_new) {
    console.log(`updating ${key} in the chrome storage!!`);
    chrome.storage.local.set({ [key] : pomo_new }, function () {
        console.log("Successfully updated pomodoro!");
    });
}

function deletePomodoro(key) {
    console.log(`Deleting pomodoro against key : ${key}!!`);
    chrome.storage.local.remove([key], function () {
        console.log("Deleted pomodoro from database");
    });
}
