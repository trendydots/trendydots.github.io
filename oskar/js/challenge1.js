// DO NOT TOUCH THIS
AOS.init();

function menuToggle() {
  document.querySelector("#navMenu").classList.toggle("hidden");
}
document.querySelector("#navButton").addEventListener("click", menuToggle);

// END: DO NOT TOUCH THIS

// GOOGLE CHART
google.charts.load("current", { packages: ["sankey"] });

// GLOBAL CHART OPTIONS
let chartDoOptions = {
  tooltip: {
    trigger: "none"
  },
  height: "auto",
  sankey: {
    node: {
      width: 3,
      nodePadding: 80,
      label: { fontSize: 14, color: "#000", bold: false }
    },
    link: { color: { fill: "#dae1e7" } }
  }
};
let chartDontOptions = {
  tooltip: {
    trigger: "none"
  },
  height: "auto",
  sankey: {
    node: {
      width: 3,
      nodePadding: 80,
      label: { fontSize: 14, color: "#000", bold: false }
    },
    link: { color: { fill: "#ffe0b2" } }
  }
};

// DO CHART

google.charts.setOnLoadCallback(drawDoAllYearChart);
google.charts.setOnLoadCallback(drawDoSeasonsChart);

let doInputNumber = 10;
let doAllYearData = [
  ["All Year", "Leather (dark tones)", 1],
  ["Leather (dark tones)", "Oxford", 1],
  ["Leather (dark tones)", "Derby", 1],
  ["Leather (dark tones)", "Chelsea Boot", 1]
];
let doSeasonsData = [
  ["Spring", "Suade (lighter tones)", 1],
  ["Suade (lighter tones)", "Chelsea boots", 1],
  ["Autumn", "Suade (lighter tones)", 1],
  ["Suade (lighter tones)", "Chelsea boots", 1],
  ["Spring", "Suade (darker tones)", 1],
  ["Suade (darker tones)", "Chelsea boots", 1],
  ["Winter", "Suade (darker tones)", 1],
  ["Suade (darker tones)", "Chelsea boots", 1]
];

function setInputCount(newCount) {
  doInputNumber = newCount;
  document.getElementById("remaining-dos").innerHTML = newCount;
}

function drawDoAllYearChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "From");
  data.addColumn("string", "To");
  data.addColumn("number", "Weight");

  data.addRows(doAllYearData);

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.Sankey(
    document.getElementById("sankey-do-allyear")
  );
  chart.draw(data, chartDoOptions);
}

function drawDoSeasonsChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "From");
  data.addColumn("string", "To");
  data.addColumn("number", "Weight");
  data.addRows(doSeasonsData);

  var minContainerHeight =
    doSeasonsData.length * 30 > 300 ? doSeasonsData.length * 30 : 300;
  var container = document.getElementById("sankey-do-seasons");
  container.style.minHeight = minContainerHeight + "px";
  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.Sankey(container);
  chart.draw(data, chartDoOptions);
}

function addDoRecords() {
  // check for season selection
  let seasonSel = document.getElementById("do-season");
  let seasonTxt = "All Year";
  let seasonValue = -1;
  let seasonWasSelected = false;

  seasonValue = Number(seasonSel.options[seasonSel.selectedIndex].value);
  if (seasonValue > 0) {
    seasonWasSelected = true;
    seasonTxt = seasonSel.options[seasonSel.selectedIndex].text;
  }

  // check for material selection
  let materialSel = document.getElementById("do-material");
  let materialTxt = "";
  let materialWasSelected = false;

  if (materialSel.options[materialSel.selectedIndex].value > 0) {
    materialWasSelected = true;
    materialTxt = materialSel.options[materialSel.selectedIndex].text;
    //console.log("materialWasSelected ", materialWasSelected);
  }

  // check for type selection
  let typeSel = document.getElementById("do-type");
  let typeTxt = "";
  let typeWasSelected = false;

  if (typeSel.options[typeSel.selectedIndex].value > 0) {
    typeWasSelected = true;
    typeTxt = typeSel.options[typeSel.selectedIndex].text;
    //console.log("typeWasSelected ", typeWasSelected);
  }
  if (seasonValue >= 0 && doInputNumber > 0 && typeWasSelected) {
    switch (seasonValue) {
      case 0:
        if (typeWasSelected) {
          if (materialWasSelected) {
            // add to knowledge base
            doSeasonsData.push(["All Year", materialTxt, 1]);
            doSeasonsData.push([materialTxt, typeTxt, 1]);
          } else {
            doSeasonsData.push(["All Year", typeTxt, 1]);
          }
        }
        drawDoSeasonsChart();
        break;
      default:
        if (typeWasSelected) {
          if (materialWasSelected) {
            // add to knowledge base
            doSeasonsData.push([seasonTxt, materialTxt, 1]);
            doSeasonsData.push([materialTxt, typeTxt, 1]);
          } else {
            doSeasonsData.push([seasonTxt, typeTxt, 1]);
          }
        }
        console.log(doSeasonsData);
        drawDoSeasonsChart();
        break;
    }
    setInputCount(doInputNumber - 1);
  }
}

function resetDoRecords() {
  doInputNumber = 10;

  doSeasonsData = [
    ["Spring", "Suade (lighter tones)", 1],
    ["Suade (lighter tones)", "Chelsea boots", 1],
    ["Autumn", "Suade (lighter tones)", 1],
    ["Suade (lighter tones)", "Chelsea boots", 1],
    ["Spring", "Suade (darker tones)", 1],
    ["Suade (darker tones)", "Chelsea boots", 1],
    ["Winter", "Suade (darker tones)", 1],
    ["Suade (darker tones)", "Chelsea boots", 1]
  ];

  var container = document.getElementById("sankey-do-seasons");
  container.style.height = "300px";

  drawDoSeasonsChart();
  setInputCount(doInputNumber);
}

function saveDoRecords() {}

// DONT CHART
google.charts.setOnLoadCallback(drawDontSeasonsChart);

let dontInputNumber = 10;
let dontSeasonsData = [
  ["Winter", "Suade (darker tones)", 1],
  ["Suade (darker tones)", "Chelsea boots", 1],
  ["Winter", "Cotton (lighter tones)", 1],
  ["Cotton (lighter tones)", "Sandals", 1],
  ["Winter", "Cotton (lighter tones)", 1],
  ["Cotton (lighter tones)", "Espadrilles", 1],
  ["Summer", "Smooth leather (darker tones)", 1],
  ["Smooth leather (darker tones)", "Brogue boots", 1],
  ["Summer", "Smooth leather (darker tones)", 1],
  ["Smooth leather (darker tones)", "Chelsea boots", 1]
];

function setDontInputCount(newCount) {
  dontInputNumber = newCount;
  document.getElementById("remaining-donts").innerHTML = newCount;
}

function drawDontAllYearChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "From");
  data.addColumn("string", "To");
  data.addColumn("number", "Weight");

  data.addRows(dontAllYearData);

  var minContainerHeight =
    dontAllYearData.length * 40 > 200 ? dontAllYearData.length * 40 : 200;
  var container = document.getElementById("sankey-dont-allyear");
  container.style.minHeight = minContainerHeight + "px";
  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.Sankey(container);
  chart.draw(data, chartDontOptions);
}

function drawDontSeasonsChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "From");
  data.addColumn("string", "To");
  data.addColumn("number", "Weight");
  data.addRows(dontSeasonsData);

  var minContainerHeight =
    dontSeasonsData.length * 30 > 300 ? dontSeasonsData.length * 30 : 300;
  var container = document.getElementById("sankey-dont-seasons");
  container.style.minHeight = minContainerHeight + "px";
  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.Sankey(container);
  chart.draw(data, chartDontOptions);
}

function addDontRecords() {
  console.log(" --- ");

  // check for season selection
  let seasonSel = document.getElementById("dont-season");
  let seasonTxt = "All Year";
  let seasonValue = "";
  let seasonWasSelected = false;

  seasonValue = Number(seasonSel.options[seasonSel.selectedIndex].value);
  if (seasonValue > 0) {
    seasonWasSelected = true;
    seasonTxt = seasonSel.options[seasonSel.selectedIndex].text;
  }

  // check for material selection
  let materialSel = document.getElementById("dont-material");
  let materialTxt = "";
  let materialWasSelected = false;

  if (materialSel.options[materialSel.selectedIndex].value > 0) {
    materialWasSelected = true;
    materialTxt = materialSel.options[materialSel.selectedIndex].text;
    //console.log("materialWasSelected ", materialWasSelected);
  }

  // check for type selection
  let typeSel = document.getElementById("dont-type");
  let typeTxt = "";
  let typeWasSelected = false;

  if (typeSel.options[typeSel.selectedIndex].value > 0) {
    typeWasSelected = true;
    typeTxt = typeSel.options[typeSel.selectedIndex].text;
    //console.log("typeWasSelected ", typeWasSelected);
  }
  if (seasonValue >= 0 && dontInputNumber > 0 && typeWasSelected) {
    switch (seasonValue) {
      case 0:
        if (typeWasSelected) {
          if (materialWasSelected) {
            // add to knowledge base
            dontSeasonsData.push(["All Year", materialTxt, 1]);
            dontSeasonsData.push([materialTxt, typeTxt, 1]);
          } else {
            dontSeasonsData.push(["All Year", typeTxt, 1]);
          }
        }
        //drawDontAllYearChart();
        drawDontSeasonsChart();
        break;
      default:
        if (typeWasSelected) {
          if (materialWasSelected) {
            // add to knowledge base
            dontSeasonsData.push([seasonTxt, materialTxt, 1]);
            dontSeasonsData.push([materialTxt, typeTxt, 1]);
          } else {
            dontSeasonsData.push([seasonTxt, typeTxt, 1]);
          }
        }
        console.log(dontSeasonsData);
        drawDontSeasonsChart();
        break;
    }
    setDontInputCount(dontInputNumber - 1);
  }
}

function resetDontRecords() {
  dontInputNumber = 10;
  dontSeasonsData = [
    ["Winter", "Suade (darker tones)", 1],
    ["Suade (darker tones)", "Chelsea boots", 1],
    ["Winter", "Cotton (lighter tones)", 1],
    ["Cotton (lighter tones)", "Sandals", 1],
    ["Winter", "Cotton (lighter tones)", 1],
    ["Cotton (lighter tones)", "Espadrilles", 1],
    ["Summer", "Smooth leather (darker tones)", 1],
    ["Smooth leather (darker tones)", "Brogue boots", 1],
    ["Summer", "Smooth leather (darker tones)", 1],
    ["Smooth leather (darker tones)", "Chelsea boots", 1]
  ];

  var container = document.getElementById("sankey-dont-seasons");
  container.style.height = "300px";

  drawDontSeasonsChart();
  setDontInputCount(dontInputNumber);
}

function saveDontRecords() {}

function redrawCharts() {
  //drawDoAllYearChart();
  drawDoSeasonsChart();

  //drawDontAllYearChart();
  drawDontSeasonsChart();
}

window.onresize = redrawCharts;
