const formTitle = document.querySelector("#form-title");
const formTime = document.querySelector("#form-time");
const formDate = document.querySelector("#form-date");
const formTag = document.querySelector("#form-tag");
const formSubmit = document.querySelector("#form-submit");
const form = document.querySelector("#form")
const createTaskButton = document.querySelector("#create-task")

form.reset();
formSubmit.disabled = true;

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
    }
    // Validate input values (TODO: Date)
    else if (formTime.value < 1 || formTime.value > 8) {
        formSubmit.disabled = true;
    }
    else {
        formSubmit.disabled = false;
    }
}

formSubmit.addEventListener("click", () => {
    console.log(formSubmit.disabled);
    if (formSubmit.disabled == false) {
        // Form Data
        const formData = new FormData(form);
        console.log(formData);
        // Reset form button and exit
        formSubmit.disabled = true;
        const modal = document.getElementById('create_dialog_wrapper');
        modal.style.display = 'none';
    }
});
