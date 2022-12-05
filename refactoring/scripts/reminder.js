const formTitle = document.querySelector("#form-title");
const formTime = document.querySelector("#form-time");
const formDate = document.querySelector("#form-date");
const formTag = document.querySelector("#form-tag");
const formSubmit = document.querySelector("#form-submit");
const form = document.querySelector("#form")
const createTaskButton = document.querySelector("#create-task")

form.reset();
formSubmit.disabled = true;
formSubmit.title = "Fill all Fields"
const cur_date = new Date().toJSON().slice(0, 10);

createTaskButton.addEventListener("click", () => form.reset())
formTitle.addEventListener("change", formState);
formTime.addEventListener("change", formState);
formDate.addEventListener("change", formState);
formTag.addEventListener("change", formState);

function formState() {
    // If any input is empty
    if (formTitle.value == "" || formTime.value == "" ||
        formDate.value == "" || formTag.value == "Tag") {
        formSubmit.disabled = true;
        formSubmit.title = "Fill all Fields"
    }
    // Validate amount of time
    else if (formTime.value < 1 || formTime.value > 8) {
        formSubmit.disabled = true;
        formSubmit.title = "Enter Valid Time"
    }
    // Validate Date
    else if (new Date(formDate.value) < new Date(cur_date)) {
        formSubmit.disabled = true;
        formSubmit.title = "Enter Valid Date"
    }
    else {
        formSubmit.disabled = false;
        formSubmit.title = "Add Task"
    }
}

formSubmit.addEventListener("click", () => {
    if (formSubmit.disabled == false) {
        // Form Data
        const formData = new FormData(form);
        console.log(formData);
        // Reset form button and exit
        formSubmit.disabled = true;
        formSubmit.title = "Fill all Fields"
        const modal = document.getElementById('create_dialog_wrapper');
        modal.style.display = 'none';
    }
});
