import { initialPomo, renderTitle } from "./focus.js"

const DATA = "data"
const ACTIVEIDX = "activeIndex"

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

  const loadData = (state, idx) => {
    localStorage.setItem(DATA, JSON.stringify(state))
    localStorage.setItem(ACTIVEIDX, idx)
  }
  
  const listenFilterBtnClicked = (state) => {
    const upcomingBtn = document.getElementById('radio-one');
    const doneBtn = document.getElementById('radio-two');
    upcomingBtn.addEventListener('click', () => {
      state.filter.isDone = false;
      renderList(state);
    })
    doneBtn.addEventListener('click', () => {
      state.filter.isDone = true;
      renderList(state);
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
        const tabs = document.querySelectorAll('[data-main-tab-target]')
        localStorage.setItem(ACTIVEIDX, taskIdx)
        renderTitle()
        initialPomo()
        tabs[0].click()
      })
    })
  }
  
  loadData(state, -1)
  renderList(state);
  listenFilterBtnClicked(state);
  listenCreateBtnClicked(state);
  listenStartBtnClicked();
