// let lis = document.getElementById("nav").children[0].children;
// for (let i = 0 ; i < lis.length ; i ++) {
//     lis[i].setAttribute("onclick","openPage(" + i + ")")
// }

// function openPage(index) {
//     for (let i = 0 ; i < lis.length ; i ++) {
//         if (lis[i] === lis[index]) {
//             document.getElementById("page" + (i + 1)).classList.replace("close","open");
//             lis[i].classList.replace("no-checked","checked");
//         } else {
//             document.getElementById("page" + (i + 1)).classList.replace("open","close");
//             lis[i].classList.replace("checked","no-checked");
//         }
//     }
// }
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