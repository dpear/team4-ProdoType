import { initializePomo, renderTitle } from "./focus.js"
import { Pomodoro } from "./pomodoroDao.js";
import { getAllPomodoros, savePomodoro } from "./chromeStorageAdapter.js";

var backgroundPage = chrome.extension.getBackgroundPage();

const pomo1 = new Pomodoro('title1', 1, '2022-12-04', 'tags1', 'notes', false);
const pomo2 = new Pomodoro('title2', 2, '2022-12-04', 'tags2', 'notes', false);
const pomo3 = new Pomodoro('title3', 3, '2022-12-04', 'tags3', 'notes', false);
const pomo4 = new Pomodoro('title4', 4, '2022-12-04', 'tags4', 'notes', true);
const pomo5 = new Pomodoro('title5', 5, '2022-12-04', 'tags5', 'notes', true);

const loadData = () => {
  savePomodoro(pomo1);
  savePomodoro(pomo2);
  savePomodoro(pomo3);
  savePomodoro(pomo4);
  savePomodoro(pomo5);
}

async function getData() {
  let receivedRes = await getAllPomodoros()
  console.log(receivedRes)
}

const newCardItem = (title, date, tag, tomatoCount, isDone) => {
    return {
      title, date, tag, tomatoCount, isDone,
    }
  }
  
  var state = {
    items: [
      newCardItem('Play foot ball', '2019-01-01', 'Sports', 1, false),
      newCardItem('Eat', '2019-01-01', 'Sports', 1, false),
      newCardItem('Play foot ball', '2019-01-01', 'Sports', 1, false),
      newCardItem('Play foot ball', '2019-01-01', 'Sports', 1, false),
      newCardItem('Piano', '2019-01-01', 'Sports', 1, false),
      newCardItem('Play foot ball', '2019-01-01', 'Sports', 1, false),
      newCardItem('Play foot ball', '2019-01-01', 'Sports', 1, false),
      newCardItem('Play foot ball', '2019-01-01', 'Sports', 1, false),
      newCardItem('Leetcode Practice', 1, true),
      newCardItem('Play foot balll  askjdlka ', '2019-01-01', 'Sports', 1, true),
      newCardItem('Play foot balll laksjs sadaslk asdas askjdlka ', '2019-01-01', 'Sports', 1, true),
      newCardItem('Play foot blk asdas askjdlka ', '2019-01-01', 'Sports', 1, true),
      newCardItem('Play foot balll laksjd asaslk asdas askjdlka ', '2019-01-01', 'Sports', 1, true),
    ],
    filter: {
      isDone: false,
    }
  }
  
  const listenFilterBtnClicked = (state) => {
    const upcomingBtn = document.getElementById('radio-one');
    const doneBtn = document.getElementById('radio-two');
    upcomingBtn.addEventListener('click', () => {
      state.filter.isDone = false;
      renderList(state);
      listenStartBtnClicked();
    })
    doneBtn.addEventListener('click', () => {
      state.filter.isDone = true;
      renderList(state);
      listenStartBtnClicked();
    })
  }
  
  const listenCreateBtnClicked = (state) => {
    const createBtn = document.getElementById('create-task');
    const closeMask = document.getElementById('close-mask')
    createBtn.addEventListener('click', () => {
      // show create task modal
      const modal = document.getElementById('create_dialog_wrapper');
      // change css to show modal
      modal.style.display = 'block';
    })
    closeMask.addEventListener('click', () => {
      // hide create task modal
      const modal = document.getElementById('create_dialog_wrapper');
      // change css to hide modal
      modal.style.display = 'none';
    })
  }
  
  
  
  const renderList = (state) => {
    const listContainer = document.getElementById('time-line-list-container')
    listContainer.innerHTML = '';
  
    state.items
      .filter(item => item.isDone === state.filter.isDone)
      .forEach((item, index) => {
        const card = document.createElement('div')
        card.classList.add('time-line-card')
        card.innerHTML = `
          <div class="time-line-card-line-1">
            <div class="time-line-card-title">${item.title}</div>
            <div class="time-line-card-buttons">
              ${
                !item.isDone ?
                `<div key=${index} class="time-line-card-button time-line-card-button-play">
                  <ion-icon name="play-outline"></ion-icon>
                </div>
                <div key=${index} class="time-line-card-button time-line-card-button-delete">
                  <ion-icon name="trash-outline"></ion-icon>
                </div>` : ''
              }
              
            </div>
          </div>
          <div class="time-line-card-line-2">
            <div class="time-line-card-info-item time-line-card-date">${item.date}</div>
            <div class="time-line-card-info-item time-line-card-tag">${item.tag}</div>
            <div class="time-line-card-info-item time-line-card-tomato-count">
              <ion-icon class="alarm-icon" name="alarm"></ion-icon>
              ×
              ${item.tomatoCount}
            </div>
          </div>
        `
        listContainer.appendChild(card)
      })
  }

  const listenStartBtnClicked = () => {
    const taskStartBtns = document.querySelectorAll('.time-line-card-button-play')
    console.log(taskStartBtns)
    taskStartBtns.forEach(tsBtn => {
      tsBtn.addEventListener('click', () => {
        let taskIdx = Number(tsBtn.getAttribute('key'))
        let taskInfo = state.items[taskIdx]
        let taskTitle = taskInfo.title
        let tomatoExpected = taskInfo.tomatoCount
        const tabs = document.querySelectorAll('[data-main-tab-target]')
        backgroundPage.setTaskId(taskIdx)
        backgroundPage.setTaskTitle(taskTitle)
        backgroundPage.setPomoExpected(tomatoExpected)
        backgroundPage.setPomoCompleted(0)
        initializePomo()
        tabs[0].click()
      })
    })
  }
  
  loadData()
  getData()
  renderList(state);
  listenFilterBtnClicked(state);
  listenCreateBtnClicked(state);
  listenStartBtnClicked();
