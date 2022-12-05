// class ChromeStorageAdpater{
//     constructor(){
//     }

const testing_button = document.querySelectorAll(".db-testing")
testing_button.forEach((element, index) => {
    console.log("haha");
    element.addEventListener("click", getAllPomodoros);
});

function getAllPomodoros(){
    chrome.storage.local.get(["globalTime"], function(result){
        console.log("Retieved from Database" + result);
        console.log(result["globalTime"]);
    });
}
