import { timer } from "../src/data/db.js";
import { calculateTotalSeconds, elementTime } from "./utility.js";

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

const initialPomo = () => {
  clearInterval(handle);
  globalTime = calculateTotalSeconds(timer[0]);
  const timeShow = document.querySelectorAll(".time");
  timeShow.forEach((element, index) => {
    const totalTime = calculateTotalSeconds(timer[index]);
    elementTime(element, totalTime);
  });
  const startBtn = document.querySelectorAll(".start");
  startBtn.forEach((element, index) => {
    showPlay(index);
    element.classList.remove(ACTIVE);
  });
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

//Beep sound for pomodoro when complete one, there are three diffirent audios stored in the src, the three audiso correspond to three content's completed remind sound(focus, short break, long break).
timer.forEach((element) => {
  const audio = new Audio(`./src/sounds/${element.sound}`);
  audio.loop = true;
  audios.push(audio);
});

const renderTitle = () => {
  const pomoAnnotation = document.getElementById("focus-annotation");
  const pomoTaskTitle = document.getElementById("current-task");
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
    pomoTaskTitle.innerHTML = "Let's tomato!";
    pomoAnnotation.style.width = "50%";
    pomoAmount.style.display = "none";
    pomoNumberExpected.innerHTML = String(0);
    pomoNumberCompleted.innerHTML = String(0);
  }
};

//same logic as mainTabs
focusTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    focusTabContent.forEach((content) => {
      content.classList.remove(ACTIVE);
    });
    focusTabs.forEach((tab) => {
      tab.classList.remove(ACTIVE);
    });
    tab.classList.toggle(ACTIVE);
    const target = document.querySelector(tab.dataset.tabTarget);
    target.classList.toggle(ACTIVE);
    globalTime = calculateTotalSeconds(timer[index]);
    elementTime(timeShow[index], globalTime);
  });
  if (tab.classList.contains(ACTIVE)) {
    globalTime = calculateTotalSeconds(timer[index]);
    console.log(tab.dataset.tabTarget);
    if (tab.dataset.tabTarget == "#focus-time") {
      renderTitle();
    }
  }
});

/*
Set Click listener for start button, the original text displayed is "Start" 
*/
startBtn.forEach((element, index) => {
  // element.textContent = "Start"
  showPlay(index);
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
    const isActive = element.classList.contains(ACTIVE);
    if (isActive) {
      showPause(index);
    } else {
      showPlay(index);
    }
    if (isActive) {
      handle = start(index, timeShow[index], globalTime);
      console.log(handle);
    } else {
      clearInterval(handle);
      elementTime(timeShow[index], globalTime);
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

/*
Timer logic:
*/
function start(index, element, time) {
  let handle = null;
  if (time) {
    handle = setInterval(() => {
      elementTime(element, --time);
      --globalTime;
      if (time <= 0) {
        clearInterval(handle);
        showFinish(index);
        audios[index].play();
      }
    }, 1000);
  } else {
    showFinish(index);
    audios[index].play();
  }
  return handle;
}

renderTitle();
initialPomo();

export { renderTitle, initialPomo };
