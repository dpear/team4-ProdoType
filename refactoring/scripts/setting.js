// import { timer } from "../src/data/db.js";
import { renderPomo, updateTimerConfig, initializePomo } from "./focus.js";
import { saveTimeConfig, getTimeConfig } from "./chromeStorageAdapter.js";

var backgroundPage = chrome.extension.getBackgroundPage();

const configFocusTime = document.getElementById("config-focus");
const configShortBreak = document.getElementById("config-short-break");
const configLongBreak = document.getElementById("config-long-break");
const configSubmit = document.getElementById("config-submit");

configFocusTime.addEventListener("change", checkValue);
configShortBreak.addEventListener("change", checkValue);
configLongBreak.addEventListener("change", checkValue);
configSubmit.addEventListener("click", onSubmit);

setSubmit(false, "Fill all Fields");
function setSubmit(enable, mouseText) {
  configSubmit.disabled = !enable;
  configSubmit.title = mouseText;
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function inRange(value) {
  return parseInt(value) >= 1 && parseInt(value) <= 60;
}

function checkValue() {
  if (
    configFocusTime.value == "" ||
    configShortBreak.value == "" ||
    configLongBreak.value == ""
  ) {
    setSubmit(false, "Fill all Fields");
  } else if (
    !isNumeric(configFocusTime.value) ||
    !isNumeric(configShortBreak.value) ||
    !isNumeric(configLongBreak.value)
  ) {
    setSubmit(false, "Enter Interger number between 1 and 60");
  } else if (
    !inRange(configFocusTime.value) ||
    !inRange(configShortBreak.value) ||
    !inRange(configLongBreak.value)
  ) {
    setSubmit(false, "Enter Interger number between 1 and 60");
  } else {
    setSubmit(true, "set config");
  }
}

async function onSubmit() {
  await saveTimeConfig("focus", parseInt(configFocusTime.value));
  await saveTimeConfig("sbreak", parseInt(configShortBreak.value));
  await saveTimeConfig("lbreak", parseInt(configLongBreak.value));
  backgroundPage.interrupt();
  await updateTimerConfig();
  initializePomo();
  const tabs = document.querySelectorAll("[data-main-tab-target]");
  tabs[0].click();
}
