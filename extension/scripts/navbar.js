const ACTIVE = 'active'
const tabs = document.querySelectorAll('[data-main-tab-target]')
const tabContents = document.querySelectorAll('[data-main-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', ()=>{
        tabContents.forEach(content => {
            content.classList.replace("open", "close")
        })
        tabs.forEach(tab => {
            tab.classList.replace("checked", "no-checked")
        })
        tab.classList.replace("no-checked", "checked")
        const targetContent = document.querySelector(tab.dataset.mainTabTarget)
        targetContent.classList.replace("close", "open")
    })
})

//task-list read data
//utility