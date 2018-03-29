var csvData = [];
var csvContent = "data:text/csv;charset=utf-8,";

function drawKeywordList(keywords) {
    $('#keywordList').html(function() {
        var keywordListTags = '';
        keywords.forEach(function (element, index) {
            keywordListTags += `
                    <div class="form-group form-group-sm">
                        <label for="keywords`+index+`">Keywords[`+index+`]</label>
                        <div class="form-group form-group-sm">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <img src="./images/google-logo.png" style="height: 1.6em"/>
                                    </span>   
                                </div>

                                <input type="text" class="form-control" id="keywords`+index+`" disabled placeholder="Keyword" value="`+element.word+`">
                            </div>
                        </div>
                    </div>
                `
        });
        return keywordListTags;
    });
}

function drawTable(keywords) {
    
    $('#trendyTable').html(function(){
        // build table header
        var tableHeader = `<thead> 
                            <tr>`;  // table header tags
        tableHeader += '<th scope="col"> Time </th>' // table header elements
        keywords.forEach(function (element) {
            tableHeader += '<th scope="col">' + element.word + '</th>' // table header elements
        });
        tableHeader += `</tr>
                        </thead>`; // table header closing tags
        
        // build table body
        var tableBody = `<tbody>`; 
        
        for (var i=1; i<csvData.length; i++) {
            tableBody += '<tr>';
            csvData[i].forEach(function(element) {
                tableBody +='<td> '+ element +' </td>'; // table body elements
            });
            tableBody += '</tr>';
        }
        
        tableBody += `</tbody>`; // table body closing tag
        
        var tableContent = tableHeader + tableBody; // put the table html together
        return tableContent;
    })
}

function drawChart(keywords) {

    var requestString = 'http://trendydots-api-trendydots.193b.starter-ca-central-1.openshiftapps.com/googleCorrelateInterestOverTime?'
    // set keywords
    for (var i = 0; i < keywords.length; i++) {
        if(keywords[i].mid){
            requestString += '&keywords=' + keywords[i].mid; // semantic lookup first
        } else {
            if(keywords[i].word) {
                requestString += '&keywords=' + keywords[i].word; // if semantinc lookup is not possible, try full text lookup
            }
        }
        
    };
    // set startTime
    requestString += '&startTime=' + $('#dateFrom').val();
    
    // set endTime
    requestString += '&endTime=' + $('#dateTo').val();
    
    $.get(requestString, function (result) {
        csvData = result.csvOfValues;
        console.dir(csvData);
        
        for(var i=0; i<csvData[0].length; i++) {
            for(var j=0; j<keywords.length; j++)
            if(csvData[0][i] === keywords[j].mid){
                csvData[0][i] = keywords[j].word
            }
        }
        
        var data = google.visualization.arrayToDataTable(result.csvOfValues);
        
        var options = {
            chart: {
                title: '',
                subtitle: ''
            },
            animation: {
                duration: 1000,
                easing: 'out',
            },
            "legend": {
                position: 'bottom'
            },
            width: '100%',
            height: 500,
            axes: {
                x: {
                    0: {
                        side: 'bottom'
                    }
                },
            },
            /*
            backgroundColor: {
                fill: 'whitesmoke',
                fillOpacity: 1
            },
            */

        };

        var chart = new google.charts.Line(document.getElementById('chart'));
        //var chart = new google.visualization.LineChart(document.getElementById('line_top_x'));

        chart.draw(data, google.charts.Line.convertOptions(options));
        //chart.draw(data, options);

        $('#download_csv').show();
        drawTable(keywords);

    });
};

function drawMap(keywords, geocode) {

    var requestString = 'http://trendydots-api-trendydots.193b.starter-ca-central-1.openshiftapps.com/googleCorrelateInterestByRegion?'
    // set keywords
    for (var i = 0; i < keywords.length; i++) {
        if(keywords[i].mid){
            requestString += '&keywords=' + keywords[i].mid; // semantic lookup first
        } else {
            if(keywords[i].word) {
                requestString += '&keywords=' + keywords[i].word; // if semantinc lookup is not possible, try full text lookup
            }
        }
        
    };
    // set startTime
    requestString += '&startTime=' + $('#dateFrom').val();
    
    // set endTime
    requestString += '&endTime=' + $('#dateTo').val();
    
    if(geocode) {
         // set geocode
        requestString += '&geocode=' + geocode;
    }
   
    
    $.get(requestString, function (result) {
        csvData = result.csvOfValues;
        console.dir(csvData);
        
        for(var i=0; i<csvData[0].length; i++) {
            for(var j=0; j<keywords.length; j++)
            if(csvData[0][i] === keywords[j].mid){
                csvData[0][i] = keywords[j].word
            }
        };
                
        geoChartData = [ [ 'State', 'Average Value', {role: 'tooltip', p:{html:true}}] ];
        
        
        
        for (var i=1; i<csvData.length; i++) {
            var row = [];
            
            var htmlLabel = [];
            htmlLabel = csvData[0].slice(0); // add headers to array
            
            row.push(csvData[i][0]); //add geo label
            
            var averageValue = 0;
            
            for(var j=1; j<csvData[i].length; j++) {
                averageValue += csvData[i][j];
                if(j< csvData[i].length - 1){
                    htmlLabel[j] = '<li style="border-bottom:1px solid #eee;">' + htmlLabel[j] + ':<i style="color: #000; font-weight: 900">' + csvData[i][j] + '</i></li>'; 
                } else {
                     htmlLabel[j] = '<li>' + htmlLabel[j] + ':<i style="color: #000; font-weight: 900">' + csvData[i][j] + '</i></li>';
                }
                           };
            
            averageValue = Math.floor(averageValue/(csvData[i].length-1));
            row.push(averageValue); // add average value
            
            delete htmlLabel[0];
            var label = htmlLabel.reduce(function(accummulator, region) {
                return accummulator + region;
            })
            console.log(label);
            row.push(label); // add label
            geoChartData.push(row);
        };
        
        console.dir(geoChartData);
        var data = google.visualization.arrayToDataTable(geoChartData);
        
        var options = {
            tooltip: {isHtml: true},
            region: geocode,
            displayMode: 'markers',
            /*
            defaultColor: '#ffffff',
            backgroundColor: {fill: '#ffffff', stroke: '#00000' },
            datalessRegionColor: '#ffffff',
            */
            width: '100%',
            height: 700,
            lineWidth: 10,
        };

        var chart = new google.visualization.GeoChart(document.getElementById('dataMap'));
        //var chart = new google.visualization.LineChart(document.getElementById('line_top_x'));
        google.visualization.events.addListener(chart, 'ready', function(){
            console.log('I just drown now');
             $('path').attr('stroke', '#a0a0a0');
        });
        
        chart.draw(data, options);
        //chart.draw(data, options);

       
        $('#download_csv').show();
        drawTable(keywords);

    });
};

$('#download_csv').click(function () {
    console.log('I was clicked');

    csvData.forEach(function (rowArray) {
        var row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

});
$("[data-toggle=popover]").popover();
$("[data-toggle=tooltip]").tooltip();


// set dates initial values
$('#dateFrom').val('2004-01-01');

var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear()+"-"+(month)+"-"+(day);

$('#dateTo').val(today);

//Create database reference
var dbRefObject = firebase.database().ref().child("14413ec9-ce06-4880-aafc-2a0d7a06ed87");
    
//Listen to object changes
dbRefObject.once('value').then(function(snapshot){
    console.log("firebase data :)")
    var reportInput = snapshot.val();

    $('#reportTitle').html(reportInput.title);
    $('#reportStatement').html(reportInput.statement);
    $('#reportDataSource').html(reportInput.dataSource);
    
    drawKeywordList(reportInput.keywords);
    /*
    google.charts.load('upcoming', {
        'packages': ['geochart'],
        'mapsApiKey': 'AIzaSyBEvM0TVolKimQl-FnIZ6GHcvWGGG_9dsc'
    });
     */
     google.charts.load('current', {
       'packages': ['geochart'],
       // Note: you will need to get a mapsApiKey for your project.
       // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
       'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
     });
    
     google.charts.setOnLoadCallback(drawMap(reportInput.keywords, reportInput.geo));
    
    
    $('#dateFrom').change(function() {
        drawChart(drawMap(reportInput.keywords, reportInput.geo));
    });

    $('#dateTo').change(function() {
        drawChart(drawMap(reportInput.keywords, reportInput.geo));
    });

    
});

