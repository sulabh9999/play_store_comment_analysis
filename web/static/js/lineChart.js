// $(".drill_cursor").click(function(){
// //do something
// });

// show log
function showLog(msg, arg) {
    console.log(msg, arg)
}

function showWaiting(isEnable) {
	var wating = document.getElementById("waitngView");
	if (wating != null) {
		// console.log("wating.style.display:", wating.style.display);
		wating.style.display = isEnable ? "block" : "none";
		// console.log("wating.style.display now:", wating.style.display);
	} 
}

function getParmDictFromURL() {
    var entries = new URLSearchParams(window.location.search).entries();
    let result = {}
    for(let entry of entries) { // each 'entry' is a [key, value] tupple
        const [key, value] = entry;
        result[key] = value;
    }
    console.log("parmaters for GET", result);
    return result;
}

// set selected week/month/year paramter in URL parameter
function updateParmDict(key, value) {
    var dict = getParmDictFromURL();
    dict[key] = value;
    return dict;
}

function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){ return pair[1]; }
       }
       return(false);
}

function weekPressed() {
    console.log('week pressed');
    var newParameter = updateParmDict('chunkSize', 'week');
    console.log('paramter after adding time:', newParameter);
    lineChartServiceCall(newParameter); 
}

function monthPressed() {
    console.log('month pressed');
    var newParameter = updateParmDict('chunkSize', 'month');
    console.log('paramter after adding time:', newParameter);
    lineChartServiceCall(newParameter); 
}

function yearPressed() {
    console.log('year pressed');
    var newParameter = updateParmDict('chunkSize', 'year');
    console.log('paramter after adding time:', newParameter);
    lineChartServiceCall(newParameter); 
}



// $(".week").on("click", function() {
//     alert("you clicked");
// });

//-------------------------------------------------------------------------------

function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}

function jsonToDict(response) {
    function dateFormat(dateStr) {
        // url: https://github.com/phstc/jquery-dateFormat
        var formatedDate = moment(dateStr, 'YYYY-MM-DD').format('MMM DD/YY'); // 19-jan-01
        if (formatedDate != "Invalid date") {
            return formatedDate
        } else {
            showLog("Error: fetched date (%s) from server is invalid", dateStr);
            return formatedDate
        }
    }

    function toList(dict) {
        var array = new Array(['', 0, 0]); // default set values
        if (dict.hasOwnProperty("date")) {
            array[0] = dateFormat(dict["date"]);
            // console.log('date is', moment("21/10/14", "DD/MM/YY").format("MM/DD/YY"));//  return "10/21/14")
        }
        if (dict.hasOwnProperty("pCount")) {
            array[1] = dict["pCount"];
        }
        if (dict.hasOwnProperty("nCount")) {
            array[2] = dict["nCount"];
        }
        return array;
    }
    var arrayList = new Array();
    // arrayList.push(['daily', 'Positive', 'Negative']);
    var obj = $.parseJSON(response);            
    $.each(obj, function(index){
        arrayList.push(toList(obj[index]));
    });
    console.log('befre rev:', arrayList);
    // console.log('after rev:', 

    var array = reverseArr(arrayList);
    array.splice( 0, 0, ['daily', 'Positive', 'Negative']);
    return array;
}


function drawLineChart(dataSet, reason) {
    var data = google.visualization.arrayToDataTable(dataSet);
    var options = {
        title: "report",
        hAxis: {
            // title: "Years", 
            // direction:-1, 
            // slantedText:true, 
            slantedTextAngle:90
        }, 
        chart: {
          title: 'Value variation: ' + reason,
          subtitle: 'with respect to time'
        },
        // legend: {position: 'none'}
        legend: { position: 'top', alignment: 'end' }
    };

    var chart = new google.charts.Line(document.getElementById('lineChart'));
    chart.draw(data, options);
    // showWaiting(false);
}

// fetch data to draw pie chart
function lineChartServiceCall(parameteram) {
    showWaiting(true);
    $.ajax({
        url: '/lineChart',
        data:  JSON.stringify(parameteram),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
            console.log('--------------line chart response----------');
            var arrayList = jsonToDict(response);
            var reason = getQueryVariable('sliceTitle');
            console.log('--reason--', reason);
            drawLineChart(arrayList, reason);
            showWaiting(false);
        },
        error: function(error) {
            showWaiting(false);
            console.log(error);
        }
    });
}

function lineChartInit() {
    // add default paramter 
    weekPressed();
    // updateParmDict(key, value)
    // lineChartServiceCall(getParmDictFromURL());
}

function showLineChart() {
 	showWaiting(true);
    // getParmFromURL();
    google.charts.load('current', { packages: ['corechart', 'line']});
 	// google.charts.load('current', {'packages':['line']});
 	   	// google.charts.load('current',{'packages':['corechart']});
    google.charts.setOnLoadCallback(lineChartInit);
    console.log("showing line chart "); 
    // google.load("visualization", "1", {packages:["corechart"]});
    // google.setOnLoadCallback(lineChartInit);
}


/*---------------- IMPORTANT links ----------
// https://stackoverflow.com/questions/40362285/google-charts-legend-position-not-working

*/