function updateTotalCommentInCircleChart(number) {
    document.getElementById("circleTitle").innerHTML = number;
    document.getElementById("circleSubtitle").innerHTML = 'Total';
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addCountIntoTitle(title, count) {
    return title + '(' + numberWithCommas(count) + ')';
}

function drawCircleChart(response) {
     // console.log('circleChart ....: ', response['total']);
    var total = numberWithCommas(response['total'])
    // set total comment flag
    updateTotalCommentInCircleChart(total);
    var pos = response['positive'];
    var neg = response['negative'];
    var natural = response['natural'];
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        [addCountIntoTitle('positive', pos),     pos],
        [addCountIntoTitle('neative', neg),      neg],
        [addCountIntoTitle('natural', natural),  natural]
    ]);

    var options = {
        title: 'Total Activity',
        // legend: 'none',
        // titlePosition: 'none',
        pieHole: 0.8,
        // width: '100%',
        // height: '100%',
        showLables: 'true',
        // backgroundColor: 'red',
        chartArea: {
          // left: 10,
          height: '60%',
          width: '100%'
        },
    };

    var chart = new google.visualization.PieChart(document.getElementById('circlechart-container'));
    chart.draw(data, options);
    setSubmitButton(true);
}

// fetch data to draw circle chart
function circleChartInit() {
    var response = '';
    // drawCircleChart(response);
    $.ajax({
        url: '/circleChart',
        data: $('form').serialize(),
        type: 'POST',
        success: function(response) {
            console.log('circleChart response: ', response);
            setSubmitButton(true);
            drawCircleChart(response) 
        },
        error: function(error) {
            setSubmitButton(true);
            console.log('error..', error);
            drawCircleChart(response);
        }
    });
}



function showCircleChart() {
    console.log('showing circle chart..');
    google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(circleChartInit);
}


