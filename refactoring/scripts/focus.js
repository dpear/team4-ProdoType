import { timer } from "../src/data/db.js";
import { calculateTotalSeconds, elementTime } from "./utility.js";

var backgroundPage = chrome.extension.getBackgroundPage();
console.log("background page is ", backgroundPage);

const ACTIVE = "active";
const DATA = "data";
const ACTIVEIDX = "activeIndex";

const focusTabs = document.querySelectorAll("[data-tab-target]");
const focusTabContent = document.querySelectorAll("[data-tab-content]");
const timeShow = document.querySelectorAll(".time");
const startBtn = document.querySelectorAll(".start");
const playBtns = document.querySelectorAll("#action-play");
const finishBtns = document.querySelectorAll("#action-finish");
const pauseBtns = document.querySelectorAll("#action-pause");
const pomoNumberCompleted = document.getElementById("pomo-completed");
const pomoNumberExpected = document.getElementById("pomo-expected");

const audios = [];

let handle = -1;
let globalTime = 0;
let pomoAmountExpected = 8;
let pomoCompleted = 0;

var state = {
  timerState: 0, //0 -> pause, time is runing 1 -> play time is paused
  time: 3600,
  focusTab: 0,
  taskId: 0,
  taskTitle: "",
  expectedTomatoNumber: 0
};

//all start btns initialize to start
const initializePomoBtn = () => {
  const startBtn = document.querySelectorAll(".start");
  startBtn.forEach((element, index) => {
    showPlay(index);
    element.classList.remove(ACTIVE);
  });
};

const renderPomoBtnCE = (state) => {
  const startBtn = document.querySelectorAll(".start");
  const curTimerState = state.timerState;
  const curFocustTab = state.focusTab;
  startBtn.forEach((element, index) => {
    if (index == curFocustTab) {
      if (curTimerState == 0) {
        showPause(index); //time is running
        element.classList.add(ACTIVE);
      } else if (curTimerState == 1) {
        showPlay(index);
        element.classList.remove(ACTIVE);
      }
    } else {
      showPlay(index);
      element.classList.remove(ACTIVE); //time is paused
    }
  });
};

//initialize to focus time tab
const initializeFocusTab = () => {
  const focusTabs = document.querySelectorAll("[data-tab-target]");
  focusTabs.forEach((tab, index) => {
    tab.classList.add(ACTIVE);
    const target = document.querySelector(tab.dataset.tabTarget);
    target.classList.add(ACTIVE);
    if (tab.dataset.tabTarget != "#focus-time") {
      tab.classList.remove(ACTIVE);
      target.classList.remove(ACTIVE);
    }
  });
};

const renderFocusTabCE = (state) => {
  const focusTabs = document.querySelectorAll("[data-tab-target]");
  const curFocustTab = state.focusTab;
  focusTabs.forEach((tab, index) => {
    tab.classList.add(ACTIVE);
    const target = document.querySelector(tab.dataset.tabTarget);
    target.classList.add(ACTIVE);
    if (index != curFocustTab) {
      tab.classList.remove(ACTIVE);
      target.classList.remove(ACTIVE);
    }
  });
};

const initializeTimer = () => {
  const timeShow = document.querySelectorAll(".time");
  timeShow.forEach((element, index) => {
    elementTime(element, calculateTotalSeconds(timer[index]));
  });
}

const renderTimer = (state) => {
  const curFocustTab = state.focusTab;
  const curTime = state.time
  const timeShow = document.querySelectorAll(".time");
  timeShow.forEach((element, index) => {
    if (index == curFocustTab) {
      elementTime(element, curTime);
    }
  });
}

const renderTitle = () => {
  const pomoAnnotation = document.getElementById("focus-annotation");
  const pomoTaskTitle = document.getElementById("current-task");
  const pomoCompletedBtn = document.getElementById("task-completed");
  const pomoAmount = document.getElementById("pomo-amount");
  const pomoNumberCompleted = document.getElementById("pomo-completed");
  const pomoNumberExpected = document.getElementById("pomo-expected");

  if (
    localStorage.getItem(DATA) != null &&
    localStorage.getItem(ACTIVEIDX) != null &&
    localStorage.getItem(ACTIVEIDX) >= 0
  ) {
    let curIdx = Number.parseInt(localStorage.getItem(ACTIVEIDX));
    let curData = localStorage.getItem("data");
    var dataObj = JSON.parse(curData);
    var taskItems = dataObj["items"];
    var taskTitle = taskItems[curIdx]["title"];
    var tomatoExpected = taskItems[curIdx]["tomatoCount"];

    pomoTaskTitle.innerHTML = taskTitle;
    pomoAnnotation.style.width = "85%";
    pomoAmount.style.display = "flex";
    pomoNumberExpected.innerHTML = String(tomatoExpected);
  } else {
    pomoTaskTitle.innerHTML = "Let's tomato 🍅";
    pomoAnnotation.style.width = "50%";
    pomoAmount.style.display = "none";
    pomoNumberExpected.innerHTML = String(0);
    pomoNumberCompleted.innerHTML = String(0);
  }
};

const renderTitleFromState = (state) => {
  const pomoAnnotation = document.getElementById("focus-annotation");
  const pomoTaskTitle = document.getElementById("current-task");
  const pomoCompletedBtn = document.getElementById("task-completed");
  const pomoAmount = document.getElementById("pomo-amount");
  const pomoNumberCompleted = document.getElementById("pomo-completed");
  const pomoNumberExpected = document.getElementById("pomo-expected");

  if (state.taskId > 0 ) {
    let curTaskId = state.taskId;
    var taskTitle = state.taskTitle;
    var tomatoExpected = state.expectedTomatoNumber;

    pomoTaskTitle.innerHTML = taskTitle;
    pomoAnnotation.style.width = "85%";
    pomoAmount.style.display = "flex";
    pomoNumberExpected.innerHTML = String(tomatoExpected);
  } else {
    pomoTaskTitle.innerHTML = "Let's tomato 🍅";
    pomoAnnotation.style.width = "50%";
    pomoAmount.style.display = "none";
    pomoNumberExpected.innerHTML = String(0);
    pomoNumberCompleted.innerHTML = String(0);
  }
}

const initializePomo = () => {
  clearInterval(handle);
  globalTime = calculateTotalSeconds(timer[0]);
  renderTitle();
  initializeFocusTab();
  initializeTimer();
  initializePomoBtn();
};

//Beep sound for pomodoro when complete one, there are three diffirent audios stored in the src, the three audiso correspond to three content's completed remind sound(focus, short break, long break).
timer.forEach((element) => {
  const audio = new Audio(`./src/sounds/${element.sound}`);
  audio.loop = true;
  audios.push(audio);
});

const renderPomo = (state) => {
  //clear count down
  renderFocusTabCE(state)
  renderPomoBtnCE(state)
  renderTitleFromState(state)
  render
}

const completedBtnListenerCreate = () => {
  const pomoCompletedBtn = document.getElementById("task-completed");
  pomoCompletedBtn.addEventListener("click", () => {
    localStorage.setItem(ACTIVEIDX, -1);
    initializePomo();
  });
};

//same logic as mainTabs
focusTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    backgroundPage.interrupt();
    focusTabContent.forEach((content) => {
      content.classList.remove(ACTIVE);
    });
    focusTabs.forEach((tab) => {
      tab.classList.remove(ACTIVE);
    });
    tab.classList.toggle(ACTIVE);
    const target = document.querySelector(tab.dataset.tabTarget);
    target.classList.toggle(ACTIVE);


    //manually initialize
    clearInterval(handle);
    initializePomoBtn();
    globalTime = calculateTotalSeconds(timer[index]);
    elementTime(timeShow[index], globalTime);

    //Option1: clearing timer when switch tab db connected
    //1.clear timer 2.initialize a state:only time change 3.put in
  });
  //The title is always there, only if that task change, we change the title
  //Don't need to re-render every time click the tab

  // if (tab.classList.contains(ACTIVE)) {
  //   globalTime = calculateTotalSeconds(timer[index]);
  //   console.log(tab.dataset.tabTarget);
  //   if (tab.dataset.tabTarget == "#focus-time") {
  //     renderTitle();
  //   }
  // }
});

/*
Set Click listener for start button, the original text displayed is "Start" 
*/
startBtn.forEach((element, index) => {
  // element.textContent = "Start"
  // showPlay(index);
  // let handle
  element.addEventListener("click", () => {
    audios[index].pause();
    audios[index].currentTime = 0;
    if (globalTime == 0) {
      globalTime = calculateTotalSeconds(timer[index]);
      elementTime(timeShow[index], globalTime);
      if (element.classList.contains("focus-type")) {
        pomoCompleted += 1;
        pomoNumberCompleted.innerHTML = String(pomoCompleted);
      }
    }
    element.classList.toggle(ACTIVE);
    // Timer is running -> active -> show pause
    // Timer is paused -> inactive -> show play
    const isActive = element.classList.contains(ACTIVE);
    if (isActive) {
      showPause(index);
    } else {
      showPlay(index);
    }
    if (isActive) {
      backgroundPage.start(index, timeShow[index], 
        globalTime, startBtn[index], audios[index])
    } else {
      globalTime = backgroundPage.pause()
      elementTime(timeShow[index], globalTime)
    }
  });
});

function showPlay(index) {
  playBtns[index].style.display = "block";
  pauseBtns[index].style.display = "none";
  finishBtns[index].style.display = "none";
}

function showPause(index) {
  playBtns[index].style.display = "none";
  pauseBtns[index].style.display = "block";
  finishBtns[index].style.display = "none";
}

function showFinish(index) {
  playBtns[index].style.display = "none";
  pauseBtns[index].style.display = "none";
  finishBtns[index].style.display = "block";
}

// /*
// Timer logic:
// */
// function start(index, element, time) {
//   let handle = null;
//   if (time) {
//     handle = setInterval(() => {
//       elementTime(element, --time);
//       --globalTime;
//       if (time <= 0) {
//         clearInterval(handle);
//         showFinish(index);
//         audios[index].play();
//       }
//     }, 1000);
//   } else {
//     showFinish(index);
//     audios[index].play();
//   }
//   return handle;
// }

const renderOption = () => {
  //db interaction
  //No last active:
  initializePomo();
  //else:
  renderPomo(state)
}

renderTitle();
initializePomo();
completedBtnListenerCreate();

export { renderTitle, initializePomo };
