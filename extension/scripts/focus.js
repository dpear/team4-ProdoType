let timer = [
  {
    id: "focus_time",
    hours: 0,
    minutes: 25,
    seconds: 0,
    sound: "car1.wav",
  },
  {
    id: "short_break",
    hours: 0,
    minutes: 5,
    seconds: 0,
    sound: "car2.wav",
  },
  {
    id: "long_rest",
    hours: 0,
    minutes: 15,
    seconds: 0,
    sound: "car3.wav",
  },
]

import { calculateTotalSeconds, elementTime } from "./utility.js";
import { ChromeStorageAdapter } from "./chromeStorageAdapter.js";
import { getAllCompletedTasks, getAllUpcomingTasks, renderList } from "./timeline.js";

var dbAdapter = new ChromeStorageAdapter();

async function updateTimerConfig() {
  let focusTime = await dbAdapter.getTimeConfig("focus")
  let shortBreakTime = await dbAdapter.getTimeConfig("sbreak")
  let longBreakTime = await dbAdapter.getTimeConfig("lbreak")
  if (focusTime.focus != undefined || shortBreakTime.sbreak != undefined  || longBreakTime.lbreak != undefined ) {
    timer[0].minutes = focusTime.focus;
    timer[1].minutes = shortBreakTime.sbreak;
    timer[2].minutes = longBreakTime.lbreak;
  }
}

await updateTimerConfig()

var backgroundPage = chrome.extension.getBackgroundPage();
console.log("background page is ", backgroundPage);

var dbAdapter = new ChromeStorageAdapter();

const ACTIVE = "active";

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


//all start btns initialize to start
const initializePomoBtn = () => {
  const startBtn = document.querySelectorAll(".start");
  startBtn.forEach((element, index) => {
    showPlay(index);
    element.classList.remove(ACTIVE);
  });
};

const renderPomoBtn = () => {
  const startBtn = document.querySelectorAll(".start");
  const curBtnIdx = backgroundPage.getBtnStateIdx();
  const curFocustTab = backgroundPage.getFocusTabIdx();
  if (curFocustTab >=0 && curBtnIdx >= 0) {
    startBtn.forEach((element, index) => {
      if (index == curFocustTab) {
        if (curBtnIdx == 1) {
          showPause(index); //time is running
          element.classList.add(ACTIVE);
        } else if (curBtnIdx == 0) {
          showPlay(index);
          element.classList.remove(ACTIVE);
        } else if (curBtnIdx == 2) {
          showFinish(index);
          element.classList.add(ACTIVE);
        } else {
          showPlay(index);
          element.classList.remove(ACTIVE); //time is paused
        }
      } else {
        showPlay(index);
        element.classList.remove(ACTIVE); //time is paused
      }
    });
  } else {
    startBtn.forEach((element, index) => {
      showPlay(index);
      element.classList.remove(ACTIVE);
    });
  }
};

//initialize to focus time tab
const initializeFocusTab = () => {
  const focusTabs = document.querySelectorAll("[data-tab-target]");
  backgroundPage.setFocusTabIdx(0);
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

const renderFocusTab = () => {
  const focusTabs = document.querySelectorAll("[data-tab-target]");
  const curFocustTab = backgroundPage.getFocusTabIdx();
  if (curFocustTab >= 0) {
    focusTabs.forEach((tab, index) => {
      tab.classList.add(ACTIVE);
      const target = document.querySelector(tab.dataset.tabTarget);
      target.classList.add(ACTIVE);
      if (index != curFocustTab) {
        tab.classList.remove(ACTIVE);
        target.classList.remove(ACTIVE);
      }
    });
  } else {
    focusTabs.forEach((tab, index) => {
      tab.classList.add(ACTIVE);
      const target = document.querySelector(tab.dataset.tabTarget);
      target.classList.add(ACTIVE);
      if (tab.dataset.tabTarget != "#focus-time") {
        tab.classList.remove(ACTIVE);
        target.classList.remove(ACTIVE);
      }
    });
  }
};

const initializeTimer = () => {
  const timeShow = document.querySelectorAll(".time");
  timeShow.forEach((element, index) => {
    elementTime(element, calculateTotalSeconds(timer[index]));
  });
}

const renderTimer = () => {
  console.log(timer)
  const timeShow = document.querySelectorAll(".time");
  const curFocustTab = backgroundPage.getFocusTabIdx();
  if (curFocustTab >= 0) {
    timeShow.forEach((element, index) => {
      if (index == curFocustTab) {
        elementTime(element, backgroundPage.getGlobalTime());
      } else {
        elementTime(element, calculateTotalSeconds(timer[index]));
      }
    });
  } else {
    timeShow.forEach((element, index) => {
      elementTime(element, calculateTotalSeconds(timer[index]));
    });
  }
}

const renderTitle = () => {
  const pomoAnnotation = document.getElementById("focus-annotation");
  const pomoTaskTitle = document.getElementById("current-task");
  const pomoCompletedBtn = document.getElementById("task-completed");
  const pomoAmount = document.getElementById("pomo-amount");
  const pomoNumberCompleted = document.getElementById("pomo-completed");
  const pomoNumberExpected = document.getElementById("pomo-expected");
  const taskId = backgroundPage.getTaskId();

  if (taskId != null ) {
    let curTaskId = backgroundPage.getTaskId();
    var taskTitle = backgroundPage.getTaskTitle();
    var tomatoExpected = backgroundPage.getPomoExpected();
    var tomatoCompleted = backgroundPage.getPomoCompleted();

    pomoTaskTitle.innerHTML = taskTitle;
    pomoAnnotation.style.width = "85%";
    pomoAmount.style.display = "flex";
    pomoNumberExpected.innerHTML = String(tomatoExpected);
    pomoNumberCompleted.innerHTML = String(tomatoCompleted);
  } else {
    pomoTaskTitle.innerHTML = "Let's tomato ????";
    pomoAnnotation.style.width = "50%";
    pomoAmount.style.display = "none";
    pomoNumberExpected.innerHTML = String(0);
    pomoNumberCompleted.innerHTML = String(0);
  }
}

const initializePomo = () => {
  // clearInterval(handle);
  backgroundPage.interrupt();
  backgroundPage.setGlobalTime(calculateTotalSeconds(timer[0]));
  // globalTime = calculateTotalSeconds(timer[0]);
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

const renderPomo = () => {
  if (backgroundPage.getFocusTabIdx() >= 0) {
    renderTitle()
    renderFocusTab()
    renderTimer()
    renderPomoBtn()
  } else {
    backgroundPage.interrupt();
    backgroundPage.setGlobalTime(calculateTotalSeconds(timer[0]));
    renderTitle();
    initializeFocusTab();
    initializeTimer();
    initializePomoBtn();
  }
}

const completedBtnListenerCreate = () => {
  const pomoCompletedBtn = document.getElementById("task-completed");
  pomoCompletedBtn.addEventListener("click", async() => {
    const curTaskId = backgroundPage.getTaskId()
    if (curTaskId != null) {
      const curCompletedPomos = backgroundPage.getPomoCompleted()
      console.log("focus complete", backgroundPage.getTaskInfo())
      let pomo = backgroundPage.getTaskInfo()
      pomo.time_taken = curCompletedPomos < 1 ? 1 :curCompletedPomos
      pomo.is_completed = true
      dbAdapter.updatePomodoro(curTaskId, pomo)
      let _0 = await getAllCompletedTasks()
      let _1 = await getAllUpcomingTasks()
      renderList(backgroundPage.getTaskListTab())
    }

    backgroundPage.setTaskId(null);
    backgroundPage.setTaskTitle("");
    backgroundPage.setTaskInfo(null)
    backgroundPage.setPomoExpected(0);
    backgroundPage.setPomoCompleted(0);
    initializePomo();
  });
};

//same logic as mainTabs
focusTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    backgroundPage.interrupt();
    backgroundPage.setFocusTabIdx(index);
    focusTabContent.forEach((content) => {
      content.classList.remove(ACTIVE);
    });
    focusTabs.forEach((tab) => {
      tab.classList.remove(ACTIVE);
    });
    tab.classList.toggle(ACTIVE);
    const target = document.querySelector(tab.dataset.tabTarget);
    target.classList.toggle(ACTIVE);

    initializePomoBtn();
    backgroundPage.setGlobalTime(calculateTotalSeconds(timer[index]));
    elementTime(timeShow[index], calculateTotalSeconds(timer[index]));
  });
});

/*
Set Click listener for start button, the original text displayed is "Start" 
*/
startBtn.forEach((element, index) => {
  element.addEventListener("click", () => {
    audios[index].pause();
    audios[index].currentTime = 0;
    if (backgroundPage.getGlobalTime() == 0) {
      backgroundPage.setGlobalTime(calculateTotalSeconds(timer[index]));
      elementTime(timeShow[index], calculateTotalSeconds(timer[index]));
      if (element.classList.contains("focus-type")) {
        backgroundPage.setPomoCompleted(backgroundPage.getPomoCompleted() + 1);
        pomoNumberCompleted.innerHTML = String(backgroundPage.getPomoCompleted());
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
      // backgroundPage.start(index, timeShow[index], 
      //   backgroundPage.getGlobalTime(), startBtn[index], audios[index])
      backgroundPage.start(index, timeShow[index], 
        backgroundPage.getGlobalTime())
    } else {
      backgroundPage.interrupt()
      elementTime(timeShow[index], backgroundPage.getGlobalTime())
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.msg == "timer_completion") {
    showFinish(message.data.content);
  }
});

chrome.runtime.sendMessage({
  msg: "popup_opened",
});


function showPlay(index) {
  backgroundPage.setBtnStateIdx(0)
  playBtns[index].style.display = "block";
  pauseBtns[index].style.display = "none";
  finishBtns[index].style.display = "none";
}

function showPause(index) {
  backgroundPage.setBtnStateIdx(1)
  playBtns[index].style.display = "none";
  pauseBtns[index].style.display = "block";
  finishBtns[index].style.display = "none";
}

function showFinish(index) {
  backgroundPage.setBtnStateIdx(2)
  playBtns[index].style.display = "none";
  pauseBtns[index].style.display = "none";
  finishBtns[index].style.display = "block";
}

renderPomo();
completedBtnListenerCreate();
chrome.runtime.sendMessage({
  msg: "popup_opened"
});

export { renderTitle, initializePomo, renderPomo, updateTimerConfig };
