/**
 * JS logic pertaining to Create Task Page
 * Validates Form Data & Saves Data in Backend
*/

// Imports
import { Pomodoro } from "./pomodoroDao.js";
import { savePomodoro } from "./chromeStorageAdapter.js"
import { getAllCompletedTasks, getAllUpcomingTasks, renderList } from "./timeline.js"

var backgroundPage = chrome.extension.getBackgroundPage();

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

// Reset Form on Startup
setSubmit(false, "Fill all Fields");
const cur_date = new Date().toJSON().slice(0, 10);

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
    else if (formTime.value < 1 || formTime.value > 8) {
        setSubmit(false, "Enter Valid Pomodoro Number between 1 and 8");
    }
    // Validate Date
    else if (formDate.value < cur_date) {
        setSubmit(false, "Enter Valid Date");
    }
    // Validate Title length 
    else if (formTitle.value.length > 25) {
        setSubmit(false, "Enter title less than 25 characters");
    }
    else {
        setSubmit(true, "Add Task");
    }
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
        savePomodoro(pomodoro);
        let _ = await getAllUpcomingTasks()
        renderList(backgroundPage.getTaskListTab())

        // Reset form button and exit
        setSubmit(false, "Fill all Fields");
        const modal = document.getElementById('create_dialog_wrapper');
        modal.style.display = 'none';
    }
}