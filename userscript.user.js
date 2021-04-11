// ==UserScript==
// @name     UofT Player State
// @description Persist transcript, caption, and playback speed settings for UofT library videos
// @namespace airstrafe.net
// @version  0.1
// @grant    https://play.library.utoronto.ca/play/*
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

const BUTTON_STRINGS = {
  transcript: "Transcript",
};

let state;
// TODO probably should wait for dom ready instead of fixed delay
setTimeout(main, 1000);

async function main() {
  state = await loadState();
  restoreState();
  addEventHandlers();
}

// load state from storage
async function loadState() {
    let saved = await GM.getValue('state', '');
    try {
        return JSON.parse(saved) || {};
    } catch(e) {
        return {};
    }
}

// save entire state to storage
async function saveState() {
  await GM.setValue("state", JSON.stringify(state));
}

// update page to match state (i.e. click buttons)
function restoreState() {
  if (state.transcript) {
    const button = document.evaluate("//p[text()='" + BUTTON_STRINGS.transcript + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button) {
      button.click();
    }
  }
}

function addEventHandlers() {
  const transcriptBtn = document.evaluate("//p[text()='" + BUTTON_STRINGS.transcript + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (transcriptBtn) {
    transcriptBtn.addEventListener("click", toggleState.bind(null, "transcript"));
  }
  // TODO captions
  // TODO playback speed
  // TODO volume
}

function toggleState(prop) {
  state[prop] = !state[prop];
  saveState();
}
