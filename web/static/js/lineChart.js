// $('#selector button').click(function() {
//     // $(this).addClass('active').siblings().removeClass('active');
//     console.log('selcred buttoi', $(this));
//     // TODO: insert whatever you want to do with $(this) here
// });

// $(".btn-group > button.btn").on("click", function(){
//     alert("Value is " + this.innerHTML);
// });


function showWaiting(isEnable) {
	var wating = document.getElementById("waitngView");
	if (wating != null) {
		// console.log("wating.style.display:", wating.style.display);
		wating.style.display = isEnable ? "block" : "none";
		// console.log("wating.style.display now:", wating.style.display);
	} 
}

function selectHandler() {
    var selectedItem = chart.getSelection()[0];
    if (selectedItem) {
   	    var topping = data.getValue(selectedItem.row, 0);
        alert('The user selected ' + topping);
    }
 }


function drawLineChart(data) {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Weeks');
    data.addColumn('number', 'Positive');
    // data.addColumn('number', 'Negative');


    function toList(dict) {
        return Object.keys(dict).map(function (key) {
            return [key, dict[key]];
        });
    }

    var resultList = [];
    for (var each in data) {
        // var list = toList(each);
        console.log('list is ', list);

    }
    
    // console.log('final paramtte:', resultList);
    data.addRows(resultList);
    // data.addRows([
    //     [1,  37.8],
    //     [2,  30.9],
    //     [3,  25.4],
    //     [4,  11.7],
    //     [5,  11.9],
    //     [6,   8.8],
    //     [7,   7.6],
    //     [8,  12.3],
    //     [9,  16.9],
    //     [10, 12.8],
    //     [11,  5.3],
    //     [12,  6.6],
    //     [13,  4.8],
    //     [14,  4.2]
    // ]);

    var options = {
        chart: {
          title: 'Value variation: ' + 'crash',
          subtitle: 'with respect to time'
        },
        // legend: {position: 'none'}
        legend: { 
          	position: 'bottom', 
        	// alignment: 'center' ,
        	// orientation: 'vertical',
    	},
        // width: 1000,
        // height: 500,
        // theme: 'material',
        chartArea: {
		    // height: '100%'
		},
    };

    var chart = new google.charts.Line(document.getElementById('lineChart'));
    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, options);
    showWaiting(false);
}

// fetch data to draw pie chart
function lineChartInit() {
    $.ajax({
        url: '/lineChart',
        data: $('form').serialize(),
        type: 'POST',
        success: function(response) {
            console.log('--------------line chart response----------');
            console.log(response);
            drawLineChart(response);
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
 	google.charts.load('current', {'packages':['line']});
 	  //  	google.charts.load('current',{'packages':['corechart']});
    google.charts.setOnLoadCallback(lineChartInit);
    console.log("showing line chart "); 
}


/*---------------- IMPORTANT links ----------
// https://stackoverflow.com/questions/40362285/google-charts-legend-position-not-working

*/