// Imports
import { Pomodoro } from "./pomodoroDao.js";
import { savePomodoro } from "./chromeStorageAdapter.js"

// HTML Elements
const formTitle = document.querySelector("#form-title");
const formTime = document.querySelector("#form-time");
const formDate = document.querySelector("#form-date");
const formTag = document.querySelector("#form-tag");
const formSubmit = document.querySelector("#form-submit");
const form = document.querySelector("#form");
const createTaskButton = document.querySelector("#create-task");

// Enable/Disable Submit Button and Set Mouse Text
function setSubmit(enable, mouseText) {
    formSubmit.disabled = !enable;
    formSubmit.title = mouseText
}

// Reset Form on Startup
form.reset();
setSubmit(false, "Fill all Fields");
const cur_date = new Date().toJSON().slice(0, 10);

// Event Listeners
createTaskButton.addEventListener("click", () => form.reset())
formTitle.addEventListener("change", formState);
formTime.addEventListener("change", formState);
formDate.addEventListener("change", formState);
formTag.addEventListener("change", formState);

function formState() {
    // If any input is empty
    if (formTitle.value == "" || formTime.value == "" ||
        formDate.value == "" || formTag.value == "Tag") {
        setSubmit(false, "Fill all Fields");
    }
    // Validate amount of time
    else if (formTime.value < 1 || formTime.value > 8) {
        setSubmit(false, "Enter Valid Time");
    }
    // Validate Date
    // else if (new Date(formDate.value) < new Date(cur_date)) {
    //     formSubmit.disabled = true;
    //     formSubmit.title = "Enter Valid Date"
    // }
    else {
        setSubmit(true, "Add Task");
    }
}

formSubmit.addEventListener("click", () => {
    if (formSubmit.disabled == false) {
        // Save Form Data
        const formData = new FormData(form);
        let pomodoro = new Pomodoro(formData.get('title'), parseInt(formData.get('time')),
                                    formData.get('date'), [formData.get('tag')], "", false);
        console.log(pomodoro);
        savePomodoro(pomodoro);

        // Reset form button and exit
        setSubmit(false, "Fill all Fields");
        const modal = document.getElementById('create_dialog_wrapper');
        modal.style.display = 'none';
    }
});
