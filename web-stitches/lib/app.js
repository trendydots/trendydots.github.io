const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");
const firebase = require("firebase");

const stitchesCSSPath = "https://trendydots.com/invest/assets/css/stitches.css";
const googleChartsPath = "https://www.gstatic.com/charts/loader.js";
const fontMuliPath = "https://fonts.googleapis.com/css?family=Muli:300,400,600,700,800,900";
const fontAwesomePath = "https://use.fontawesome.com/releases/v5.6.3/css/all.css";
const fontAwesomeIntegrity = "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/";

let stitchesHTML = html => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href=${stitchesCSSPath} rel="stylesheet">
    <link href=${fontMuliPath} rel="stylesheet">
    <link rel="stylesheet" href=${fontAwesomePath} integrity=${fontAwesomeIntegrity} crossorigin="anonymous">
    <title>td. web stitches</title>
    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    
    <!--Load Google Charts via the AJAX API-->
    <script type="text/javascript" src=${googleChartsPath}></script>
    
    <script> 
    $(window).resize(function () {
      $(window).trigger("window:resize")
   })
    </script>
  </head>
  <body>${html}</body>
</html>`;

/** Firebase config & init */
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLGjL7GtMFne5DA6_O3iSFtOFKNTWnvVA",
  authDomain: "td-web-stitches.firebaseapp.com",
  databaseURL: "https://td-web-stitches.firebaseio.com",
  projectId: "td-web-stitches",
  storageBucket: "",
  messagingSenderId: "82906201863",
  appId: "1:82906201863:web:606aab92a95488eed38fa2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

let platformConfig = {};
let templates = [];

database.ref("/platformConfig").once("value").then(function (snapshot) {
  platformConfig = snapshot.val();
});

database.ref("/templates").once("value").then(function (snapshot) {
  templates = snapshot.val();
});

/** ExpressJS stuff that needs to be replaced */
app.use(morgan("combined"));
app.use(express.static("."));
app.use(bodyParser.json());

app.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../index.html"));
});

app.post("/download", (req, res) => {
  let templates = req.body.data; // e.g. [ 'nav-1', 'hero-1' ]
  let file = path.join(__dirname + "/../stitches.html");
  let html = "";

  templates.forEach(template => {
    html += fs.readFileSync(path.join(__dirname + `/../templates/${template}.html`), "utf-8");
  });

  fs.writeFile(file, stitchesHTML(html), "utf8", err => {
    if (err) throw err;
    res.download(file);
    res.json({ data: stitchesHTML(html) });
  });
});

app.post("/downloadFromFB", (req, res) => {
  let templateNames = req.body.data; // e.g. [ 'nav-1', 'hero-1' ]
  let html = "";
  for (let i = 0; i < templateNames.length; i++) {
    const templateFromFB = templates.find(template => template.name === templateNames[i]);
    html += templateFromFB ? templateFromFB.snippet : "";
  }
  res.json({ data: stitchesHTML(html) });
});

app.listen(3000, () => console.log("td. web stitches is available at http://localhost:3000 "));