/**
 * JS logic pertaining to Create Task Page
 * Validates Form Data & Saves Data in Backend
*/

// Imports
import { Pomodoro } from "./pomodoroDao.js";
import { ChromeStorageAdapter } from "./chromeStorageAdapter.js"
import { getAllCompletedTasks, getAllUpcomingTasks, renderList } from "./timeline.js"

var backgroundPage = chrome.extension.getBackgroundPage();

//DB Adapter
var dbAdapter = new ChromeStorageAdapter();

// HTML Elements
const formTitle = document.querySelector("#form-title");
const formTime = document.querySelector("#form-time");
const formDate = document.querySelector("#form-date");
const formTag = document.querySelector("#form-tag");
const formSubmit = document.querySelector("#form-submit");
const form = document.querySelector("#form");
const createTaskButton = document.querySelector("#create-task");

// Event Listeners
formTitle.addEventListener("change", formState);
formTime.addEventListener("change", formState);
formDate.addEventListener("change", formState);
formTag.addEventListener("change", formState);
formSubmit.addEventListener("click", onSubmit);
createTaskButton.addEventListener("click", () => form.reset())

// Disable Keyboard Input to Date Element
formDate.testing = false;
formDate.addEventListener("keydown", event => {
    if (!formDate.testing) {
        event.preventDefault();
        return false
    }
});

// Reset Form on Startup
setSubmit(false, "Fill all Fields");
const today = new Date();
const padDate = s => (s.length == 1) ? '0' + s : s
let cur_date = String(today.getFullYear()) + '-' + padDate(String(today.getMonth() + 1)) + '-' + padDate(String(today.getDate()))

/**
 * Enable/Disable Submit Button and Set Mouse Text
 * @param {boolean} enable - Whether or not Submit Button Should be Enabled
 * @param {string} mouseText - Text to be displayed on mouse over
*/
function setSubmit(enable, mouseText) {
    formSubmit.disabled = !enable;
    formSubmit.title = mouseText
}

/**
 * Form Element Change Event Callback
 * Check State of the Form
*/
function formState() {
    // If any input is empty
    if (formTitle.value == "" || formTime.value == "" ||
        formDate.value == "" || formTag.value == "Tag") {
        setSubmit(false, "Fill all Fields");
    }
    // Validate amount of time
    else if (parseInt(formTime.value) < 1 || parseInt(formTime.value) > 8) {
        setSubmit(false, "Enter Valid Pomodoro Number between 1 and 8");
    }
    // Validate Date
    else if (formDate.value < cur_date) {
        setSubmit(false, "Enter Valid Date");
    }
    // Validate Title length
    else if (formTitle.value.length > 25) {
        setSubmit(false, "Enter Title less than 25 Characters");
    }
    else {
        setSubmit(true, "Add Task");
    }
    console.log(formDate.value, cur_date)
}

/**
 * Submit Button Click Event Callback
 * Save with Backend and Exit
*/
async function onSubmit() {
    if (formSubmit.disabled == false) {
        // Save Form Data
        const formData = new FormData(form);
        let pomodoro = new Pomodoro(formData.get('title').trim(), parseInt(formData.get('time')),
                                    formData.get('date'), [formData.get('tag')], "", false);
        dbAdapter.savePomodoro(pomodoro);
        let _ = await getAllUpcomingTasks()
        renderList(backgroundPage.getTaskListTab())

        // Reset form button and exit
        setSubmit(false, "Fill all Fields");
        const modal = document.getElementById('create_dialog_wrapper');
        modal.style.display = 'none';
    }
}
