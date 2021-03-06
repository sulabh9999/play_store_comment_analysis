// global var to store parameters
var parameters = {};
var pieChartResponse;

String.prototype.trunc =
 function( n, useWordBoundary=true ){
     if (this.length <= n) { return this; }
     var subString = this.substr(0, n-1);
     return (useWordBoundary 
        ? subString.substr(0, subString.lastIndexOf(' ')) 
        : subString) + "&hellip;";
};

// ------------------------ pie chart response ---------------
function storePieChartResponse(response) {
	pieChartResponse = response;
}

function getResponseForIndex(index) {
	return pieChartResponse[index]
}

// ---------------------------- store serilized paramters for lineChart----------------
function storeReqParm(param) {
	parameters = {};
	$.each($('form').serializeArray(), function() {
	    parameters[this.name] = this.value;
	});
}

function updateReqParm(key, value) {
	parameters[key] = value;
	console.log("request paramter after update:", parameters)
}

function getParm(isForNeg=true) {
	return jQuery.param( parameters);
}

//------------------------------------------------------------------------

// set title for google pie chart
function setTitleForPieChart(title, count) {
	return title + '('+ count + ')' ;
}

// set tooltip
function setTooltipForPieChart(reason, count, comment, link) {
    return '<div><b>' + reason + ' (' + count + ') </b><br>' + 
       comment + '<br> <a href="https://www.w3schools.com/html/">show more</a>' + '</div>';
}

function isExist(data) {
	return !(data == undefined || data == "" || data.length == 0);
}

function pieChartOption(topic, count) {
	return {
		'title': setTitleForPieChart(topic, count),
		'titleTextStyle': {
	        'color': 'gray',    // any HTML string color ('red', '#cc00cc')
	        'fontName': 'Times New Roman', // i.e. 'Times New Roman'
	        'fontSize': 18, // 12, 18 whatever you want (don't specify px)
	        'bold': true    // true or false
	    },
		'backgroundColor':'lightGray',
	  	'width':200, 'height':250,
		// 'is3D': true,
		'pieSliceText': 'label',
		'legend': 'none',
		'tooltip': {
			'textStyle':{
				'bold': true,
				'color': '#000000',
				'fontSize': 13
			},
			'showColorCode': true,
			'isHtml': true,
			'ignoreBounds': true
			//'text': 'both'
		}
	};
};

// Draw the chart and set the chart values
function drawPieChart(topic, data, divId) {
	console.log('topic is:', topic); // print topic
	var topicFreq = data[0];
	var reasonDict = data[1];
	console.log(reasonDict); // print details for topic  
	console.log("-------------------------------");

	var data = new google.visualization.DataTable();
    data.addColumn('string', 'reason');
    data.addColumn('number', 'frequency');
    data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
  	data.addRows(reasonDict.length);

	var result = []
	$.each(reasonDict, function(i) {
		var reason = reasonDict[i][0];
		var frequency=reasonDict[i][1];
		var comment = reasonDict[i][2][0][1];

		if (isExist(reason) && isExist(comment)) {
		    data.setCell(i, 0, reason);
		    data.setCell(i, 1, frequency);
		    data.setCell(i, 2, setTooltipForPieChart(reason, frequency, comment.trunc(100), 'link_url'));
		} 
	});

	// Optional; add a title and set the width and height of the chart
	var options = pieChartOption(topic, topicFreq);

	// Display the chart inside the <div> element with id="piechart"
	var chart = new google.visualization.PieChart(document.getElementById(divId));
    
    function redirect(){
    	var base_url = window.location.origin;
		var url = base_url + "/lineChart?" +  getParm();
		console.log("GET call for line chart page:", url);
		window.open(url, '_top');
	}

    function selectHandler() {
    	var selection = chart.getSelection();
	    if (selection.length) {
	        var pieSliceLabel = data.getValue(selection[0].row, 0);
	        console.log("ouutput:", (pieSliceLabel));
	        updateReqParm("sliceTitle", pieSliceLabel);
	        redirect();
	    }
    }
    google.visualization.events.addListener(chart, 'select', selectHandler);
	chart.draw(data, options);
}


// fetch data to draw pie chart
function pieChartInit() {
	$.ajax({
        url: '/pieChart',
        data: $('form').serialize(),
        type: 'POST',
        success: function(response) {
            // console.log(response);
            storeReqParm($('form').serializeArray());
            storePieChartResponse(response);
            setSubmitButton(true);
    
            $.each(response, function(i) {
            	var topic = response[i][0];
            	var data = response[i][1];

            	var divId = i; //"chart-" + topic;
	            var div = document.createElement('div');
	            div.id = divId
	            div.className = "pieChartUnit"
	            div.innerHTML = `<div></div>`;
	            document.getElementById('piechart-container').appendChild(div);
	            // pieChart.js -> drawChart()
				drawPieChart(topic, data, divId);
				$('.pieChartUnit').unbind().click(function(e){
					// e.stopPropagation();
					var index = e.currentTarget.id;
			        console.log(index);
			        // console.log("response for index:", getResponseForIndex(index));
			        updateReqParm("pieChartTitle", getResponseForIndex(index)[0]);
		        });
			});
        },
        error: function(error) {
        	setSubmitButton(true);
            console.log(error);
        }
    });
}


function showPieChart() {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(pieChartInit);
}






//---------------------------------------------------------------------
//---------------------------- dummy chart methods --------------------

function showDummyPieChart() {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

    function redirect(){
    	var base_url = window.location.origin;
		var url = base_url + "/lineChart";
		window.open(url, '_top');
	}
      
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
          title: 'My Daily Activities',
          'legend': 'none'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart-container'));
           // Instantiate and draw our chart, passing in some options.
	    google.visualization.events.addListener(chart, 'select', selectHandler);
        
        function selectHandler() {
		    var selectedItem = chart.getSelection()[0];
		    if (selectedItem) {
		    	var topping = data.getValue(selectedItem.row, 0);
		    	redirect();
		    	// alert('The user selected ' + selectedItem);
		  	}
	    }
        chart.draw(data, options);

        setSubmitButton(true);
      }
}