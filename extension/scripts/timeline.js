import { initializePomo, renderTitle } from "./focus.js";
import { Pomodoro } from "./pomodoroDao.js";
import {ChromeStorageAdapter} from "./chromeStorageAdapter.js";

var backgroundPage = chrome.extension.getBackgroundPage();

//DB Adapter
var dbAdapter = new ChromeStorageAdapter();

let upcomingState = [];
let completedState = [];

async function getAllUpcomingTasks() {
  let receivedRes = await dbAdapter.getAllUpcomingPomodoros();
  upcomingState = Object.entries(receivedRes);
}

async function getAllCompletedTasks() {
  let receivedRes = await dbAdapter.getAllCompletedPomodoros();
  completedState = Object.entries(receivedRes);
}

const listenFilterBtnClicked = () => {
  const upcomingBtn = document.getElementById("radio-one");
  const doneBtn = document.getElementById("radio-two");
  upcomingBtn.addEventListener("click", async () => {
    backgroundPage.setTaskListTab(0);
    renderList(0);
  });
  doneBtn.addEventListener("click", async () => {
    backgroundPage.setTaskListTab(1);
    renderList(1);
  });
};

const listenCreateBtnClicked = () => {
  const createBtn = document.getElementById("create-task");
  const closeMask = document.getElementById("close-mask");
  createBtn.addEventListener("click", () => {
    // show create task modal
    const modal = document.getElementById("create_dialog_wrapper");
    // change css to show modal
    modal.style.display = "block";
  });
  closeMask.addEventListener("click", () => {
    // hide create task modal
    const modal = document.getElementById("create_dialog_wrapper");
    // change css to hide modal
    modal.style.display = "none";
  });
};

//0 -> upcoming 1 -> completed
const renderList = (option) => {
  const listContainer = document.getElementById("time-line-list-container");
  listContainer.innerHTML = "";

  let state = option == 1 ? completedState : upcomingState;
  console.log(state)

  state.forEach((data) => {
    let taskId = data[0];
    let taskInfo = data[1];
    // console.log(taskId, taskInfo)
    const card = document.createElement("div");
    card.classList.add("time-line-card");
    card.innerHTML = `
        <div class="time-line-card-line-1">
          <div class="time-line-card-title">${taskInfo.title}</div>
          <div class="time-line-card-buttons">
            ${
              !taskInfo.is_completed
                ? `<div key=${taskId} class="time-line-card-button time-line-card-button-play">
                <ion-icon name="play-outline"></ion-icon>
              </div>
              <div key=${taskId} class="time-line-card-button time-line-card-button-delete">
                <ion-icon name="trash-outline"></ion-icon>
              </div>`
                : `<div key=${taskId} class="time-line-card-button time-line-card-button-delete">
                <ion-icon name="trash-outline"></ion-icon>
              </div>`
            }
            
          </div>
        </div>
        <div class="time-line-card-line-2">
          <div class="time-line-card-info-item time-line-card-date">${
            taskInfo.date_of_execution
          }</div>
          <div class="time-line-card-info-item time-line-card-tag">${
            taskInfo.tags
          }</div>
          <div class="time-line-card-info-item time-line-card-tomato-count">
            <ion-icon class="alarm-icon" name="alarm"></ion-icon>
            ??
            ${taskInfo.time_taken}
          </div>
        </div>
      `;
    listContainer.appendChild(card);

    if (option == 0) {
      listenStartBtnClicked();
      listenDeleteBtnClicked();
    } else if (option == 1) {
      listenDeleteBtnClicked();
    }
  });
};

const listenStartBtnClicked = () => {
  const taskStartBtns = document.querySelectorAll(
    ".time-line-card-button-play"
  );
  taskStartBtns.forEach((tsBtn) => {
    tsBtn.addEventListener("click", async () => {
      let taskId = tsBtn.getAttribute("key");
      const tabs = document.querySelectorAll("[data-main-tab-target]");
      //different task
      if (taskId != backgroundPage.getTaskId()) {
        let getTaskInfo = await dbAdapter.getPomodoroByTaskID(taskId)
        let data = Object.entries(getTaskInfo);
        let taskInfo = data[0][1]
        let taskTitle = taskInfo.title;
        let tomatoExpected = taskInfo.time_taken;
  
        backgroundPage.setTaskId(taskId);
        backgroundPage.setTaskTitle(taskTitle);
        backgroundPage.setTaskInfo(taskInfo);
        backgroundPage.setPomoExpected(tomatoExpected);
        backgroundPage.setPomoCompleted(0); 
      }

      initializePomo();
      tabs[0].click();
    });
  });
};

const listenDeleteBtnClicked = () => {
  const taskDeleteBtns = document.querySelectorAll(
    ".time-line-card-button-delete"
  );
  taskDeleteBtns.forEach((tdBtn) => {
    tdBtn.addEventListener("click", async () => {
      let taskId = tdBtn.getAttribute("key");
      //current focusing task
      if (taskId == backgroundPage.getTaskId()) {
        //clear all info
        backgroundPage.setTaskId(null);
        backgroundPage.setTaskTitle("");
        backgroundPage.setTaskInfo(null)
        backgroundPage.setPomoExpected(0);
        backgroundPage.setPomoCompleted(0);
        initializePomo();
      }
      dbAdapter.deletePomodoro(taskId);
      let _0 = await getAllCompletedTasks();
      let _1 = await getAllUpcomingTasks();
      renderList(backgroundPage.getTaskListTab());
    });
  });
};

// loadData();
let _0 = await getAllUpcomingTasks();
let _1 = await getAllCompletedTasks();
renderList(0);
listenFilterBtnClicked();
listenCreateBtnClicked();

export { getAllCompletedTasks, getAllUpcomingTasks, renderList };
