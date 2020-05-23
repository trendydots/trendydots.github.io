"use strict";

let speechSynthesis = window.speechSynthesis || false;
const speechUtterance = !!window.SpeechSynthesisUtterance
  ? new window.SpeechSynthesisUtterance()
  : false;

let languageSelect = $("#language-select");
let firstVoiceSelect = $("#first-voice-select");
let secondVoiceSelect = $("#second-voice-select");

let title = $("#title-input");
let mainStatement = $("#main-statement-input");
let conclusion = $("#conclusion-input");

$(document).on("keyup", ".input-field", function () {
  showWordCount();
});

const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const cancelButton = document.getElementById("cancel-button");

let voices = [];
let firstSelectedVoice = null;
let firstSelectedVoiceString = "";
let secondSelectedVoice = null;
let secondSelectedVoiceString = "";

function findFirstSelectedVoice(voice) {
  return voice.name.startsWith(firstSelectedVoiceString);
}

function findSecondSelectedVoice(voice) {
  return voice.name.startsWith(secondSelectedVoiceString);
}

function findDefaultVoice(voice) {
  return voice.default === true;
}

function _onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function _wordCount(str) {
  return str.split(" ").length;
}

function speechUtteranceChunker(utt, settings, callback) {
  settings = settings || {};
  var newUtt;
  var txt =
    settings && settings.offset !== undefined
      ? utt.text.substring(settings.offset)
      : utt.text;
  if (utt.voice && utt.voice.voiceURI === "native") {
    // Not part of the spec
    newUtt = utt;
    newUtt.text = txt;
    newUtt.addEventListener("end", function () {
      if (speechUtteranceChunker.cancel) {
        speechUtteranceChunker.cancel = false;
      }
      if (callback !== undefined) {
        callback();
      }
    });
  } else {
    var chunkLength = (settings && settings.chunkLength) || 160;
    var pattRegex = new RegExp(
      "^[\\s\\S]{" +
        Math.floor(chunkLength / 2) +
        "," +
        chunkLength +
        "}[.!?,]{1}|^[\\s\\S]{1," +
        chunkLength +
        "}$|^[\\s\\S]{1," +
        chunkLength +
        "} "
    );
    var chunkArr = txt.match(pattRegex);

    if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
      //call once all text has been spoken...
      if (callback !== undefined) {
        callback();
      }
      return;
    }
    var chunk = chunkArr[0];
    newUtt = new window.SpeechSynthesisUtterance(chunk);
    var x;
    for (x in utt) {
      if (x !== "text") {
        newUtt[x] = utt[x];
      }
    }
    console.log("utt", utt);
    console.log("newUTT", newUtt);
    newUtt.addEventListener("end", function () {
      if (speechUtteranceChunker.cancel) {
        speechUtteranceChunker.cancel = false;
        return;
      }
      settings.offset = settings.offset || 0;
      settings.offset += chunk.length - 1;
      speechUtteranceChunker(utt, settings, callback);
    });
  }

  if (settings.modifier) {
    settings.modifier(newUtt);
  }
  console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
  //placing the speak invocation inside a callback fixes ordering and onend issues.
  setTimeout(function () {
    speechSynthesis.speak(newUtt);
  }, 0);
}

function showWordCount() {
  console.log("triggered!");

  var textToSay =
    "" + title.val() + " " + mainStatement.val() + " " + conclusion.val();
  $("#number-of-words").html(_wordCount(textToSay));
}

function initVoices() {
  setTimeout(function () {
    voices = speechSynthesis.getVoices();
    var langs = voices.map((voice) => voice.lang.slice(0, 2));
    var distinctLanguages = langs.filter(_onlyUnique);

    for (var i in distinctLanguages) {
      var o = new Option(distinctLanguages[i], distinctLanguages[i]);
      /// jquerify the DOM object 'o' so we can use the html method
      $(o).html(isoLangs[distinctLanguages[i]].name);
      languageSelect.append(o);
    }

    var voiceOptions = voices.filter(
      (voice) => voice.lang.slice(0, 2) === distinctLanguages[0]
    );
    voiceOptions = voiceOptions.reverse();

    firstVoiceSelect.find("option").remove().end();
    secondVoiceSelect.find("option").remove().end();

    for (var i in voiceOptions) {
      var o = new Option(voiceOptions[i].voiceURI, voiceOptions[i].voiceURI);
      /// jquerify the DOM object 'o' so we can use the html method
      $(o).html(voiceOptions[i].voiceURI);
      firstVoiceSelect.append(o.cloneNode(true));
      secondVoiceSelect.append(o.cloneNode(true));
    }

    firstSelectedVoice = voiceOptions[0];
    secondSelectedVoice = voiceOptions[0];
  }, 200);
}

languageSelect.on("change", function () {
  var voiceOptions = voices.filter(
    (voice) => voice.lang.slice(0, 2) === this.value
  );
  voiceOptions = voiceOptions.reverse();

  firstVoiceSelect.find("option").remove().end();
  secondVoiceSelect.find("option").remove().end();

  for (var i in voiceOptions) {
    var o = new Option(voiceOptions[i].voiceURI, voiceOptions[i].voiceURI);
    /// jquerify the DOM object 'o' so we can use the html method
    $(o).html(voiceOptions[i].voiceURI);
    firstVoiceSelect.append(o.cloneNode(true));
    secondVoiceSelect.append(o.cloneNode(true));
  }

  firstSelectedVoice = voiceOptions[0];
  secondSelectedVoice = voiceOptions[0];
});

firstVoiceSelect.on("change", function () {
  firstSelectedVoiceString = this.value;
  firstSelectedVoice = voices.find(findFirstSelectedVoice);
});

secondVoiceSelect.on("change", function () {
  secondSelectedVoiceString = this.value;
  secondSelectedVoice = voices.find(findSecondSelectedVoice);
});

function onSpeechUtteranceEvents() {
  /*
  speechUtterance.addEventListener("start", () => {
    console.log(`Start speaking to the user.`);
  });

  speechUtterance.addEventListener("error", (event) => {
    console.log(`Woops! Something went wrong: ${event.error}`);
  });

  speechUtterance.addEventListener("end", () => {
    console.log(`Stop speaking to the user.`);
    cancelButton.disabled = true;
    resumeButton.disabled = true;
    pauseButton.disabled = true;
    playButton.disabled = false;
    speechSynthesis.cancel();
  });
  */
}

function onPlay() {
  playButton.addEventListener("click", () => {
    speechSynthesis.cancel();

    var firstSpeechUtterance = new window.SpeechSynthesisUtterance();
    firstSpeechUtterance.voice = firstSelectedVoice;
    firstSpeechUtterance.lang = firstSelectedVoice.lang;
    firstSpeechUtterance.volume = 1;
    firstSpeechUtterance.pitch = 1;
    firstSpeechUtterance.rate = 1;
    firstSpeechUtterance.text = "" + title.val() + " . " + mainStatement.val();

    console.dir(firstSpeechUtterance);
    //speechSynthesis.speak(firstSpeechUtterance);

    var secondSpeechUtterance = new window.SpeechSynthesisUtterance();
    secondSpeechUtterance.voice = secondSelectedVoice;
    secondSpeechUtterance.lang = secondSelectedVoice.lang;
    secondSpeechUtterance.volume = 1;
    secondSpeechUtterance.pitch = 1;
    secondSpeechUtterance.rate = 1;
    secondSpeechUtterance.text = "" + conclusion.val();
    //speechSynthesis.speak(secondSpeechUtterance);
    console.dir(secondSpeechUtterance);

    speechUtteranceChunker(
      firstSpeechUtterance,
      {
        chunkLength: 240,
      },
      function () {
        //some code to execute when done
        console.log("first done");
        speechUtteranceChunker(
          secondSpeechUtterance,
          {
            chunkLength: 240,
          },
          function () {
            //some code to execute when done
            console.log("second done");
          }
        );
      }
    );

    cancelButton.disabled = false;
    pauseButton.disabled = false;
    playButton.disabled = true;
  });
}

function onPause() {
  pauseButton.addEventListener("click", () => {
    console.log(`Pause speaking to the user.`);
    resumeButton.disabled = false;
    pauseButton.disabled = true;
    speechSynthesis.pause();
  });
}

function onResume() {
  resumeButton.addEventListener("click", () => {
    console.log(`Resume speaking to the user.`);
    resumeButton.disabled = true;
    pauseButton.disabled = false;
    speechSynthesis.resume();
  });
}

function onCancel() {
  cancelButton.addEventListener("click", () => {
    cancelButton.disabled = true;
    resumeButton.disabled = true;
    pauseButton.disabled = true;
    playButton.disabled = false;
    speechSynthesis.cancel();
  });
}

if (speechSynthesis && speechUtterance) {
  playButton.disabled = false;
  initVoices();
  onSpeechUtteranceEvents();
  onCancel();
  onResume();
  onPause();
  onPlay();
}
