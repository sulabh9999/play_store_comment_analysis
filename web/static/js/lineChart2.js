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
    arrayList.push(['daily', 'Positive', 'Negative']);
    var obj = $.parseJSON(response);            
    $.each(obj, function(index){
        arrayList.push(toList(obj[index]));
    });

    return arrayList;
}


function drawLineChart(dataSet) {

    var data = google.visualization.arrayToDataTable(dataSet);
    var options = {
        title: "report",
        hAxis: {
            direction:-1,
            // slantedText:true,
            slantedTextAngle:90
        },
        chart: {
          title: 'Value variation: ' + 'crash',
          subtitle: 'with respect to time'
        },
        // legend: {position: 'none'}
        legend: { position: 'top', alignment: 'end' },
    };

    
    var chart = new google.visualization.LineChart(document.getElementById("lineChart"));
    // google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, options);
    // showWaiting(false);
}

// fetch data to draw pie chart
function lineChartInit() {
    $.ajax({
        url: '/lineChart',
        data: $('form').serialize(),
        type: 'POST',
        success: function(response) {
            console.log('--------------line chart response----------');
            var arrayList = jsonToDict(response);
            // console.log('arrayList:', arrayList);
            drawLineChart(arrayList);
            showWaiting(false);
        },
        error: function(error) {
            // showWaiting(false);
            console.log(error);
        }
    });
}


function showLineChart() {
    showWaiting(true);
    // google.charts.load('current', {'packages':['line']});
        google.charts.load('current',{'packages':['corechart']});
    google.charts.setOnLoadCallback(lineChartInit);
    console.log("showing line chart "); 
    // google.load("visualization", "1", {packages:["corechart"]});
    // google.setOnLoadCallback(lineChartInit);

    // function drawChartModeldaily() {
    //     var data = google.visualization.arrayToDataTable(
    //         [
    //             ['daily', 'Views', 'Likes'],
    //             ['Tue',  4, 19],
    //             ['Mon',  22, 16],
    //             ['Sat',  3, 1],
    //             ['Fri',  15, 34],
    //             ['Thu',  27, 44],
    //             ['Wed',  17, 23],
    //         ]
    //     );

        // var options = {
        //   title: "Test",
        //    hAxis: {
        //         direction:-1,
        //         slantedText:true,
        //         slantedTextAngle:90
        //     }
        // };

    //     var chart = new google.visualization.LineChart(document.getElementById("lineChart"));
    //     chart.draw(data, options);
    // }
}


/*---------------- IMPORTANT links ----------
// https://stackoverflow.com/questions/40362285/google-charts-legend-position-not-working

*/