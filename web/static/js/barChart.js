


function setTooltipForBarChart(reason, count, comment, link) {
    return '<div><b>' + reason + ' (' + count + ') </b><br>' + 
       comment + '<br> <a href="https://www.w3schools.com/html/">show more</a>' + '</div>';
}


function barChartOption() {
	return  {
        title: 'DigiBank India Android +ve reviews',
        isStacked: true,
        legend: 'none',
        height: 400,
        'tooltip': {
			'textStyle':{
				'bold': true,
				'color': '#000000',
				'fontSize': 13
			},
			'showColorCode': true,
			'isHtml': true,
			'ignoreBounds': true
		}
	}; 
}

// set header dynamic length
function setTableHeader(count) {
	var header = ['']
    for (var i = 0; i < count; i++) {
    	header.push('');
    	header.push({role: 'style'});
    	header.push({ role: 'annotation'});
    	header.push({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
    }
    return header;
}

// takes date to set only for one column(not for all columns)
function setColumn(columnData, numOfCellsInColumn) {
	console.log('columns data :', columnData);
	var title = columnData[0];
	var titleFreq = columnData[1][0];
	var detailsArray = columnData[1][1];

	var column = [];
	
	var colors = ['#00B050', '#92D050', '#AAE182', '#D7F0B4', '#D2DBC6', '#D2DBC6', '#D2DBC6', '#D2DBC6']
    
    var columnList = [title];
    for (var i = 0; i < numOfCellsInColumn; i++) {
    	var reason = detailsArray[i][0];
    	var reasonFreq = detailsArray[i][1];
    	var tooltipArray = detailsArray[i][2];

    	// var tooltipFreq = tooltipArray[0][0];
    	var tooltipComment = tooltipArray[0][1];
    	
    	columnList.push(reasonFreq);
    	columnList.push(colors[i]);
    	columnList.push(reason);
    	columnList.push(setTooltipForBarChart(reason, reasonFreq, tooltipComment.trunc(100), ''));// tooltipArray[0][1]
    }

    // var columnList = ['bank',   
    //    		300, '#00B050', 'app',      
    //    		230, '#92D050', 'login',
    //    		150, '#AAE182', 'login', 
    //    		80, '#D7F0B4', 'update',
    //    		50, '#D7F0B4', 'open'
    //    	];
    console.log('columns data aftert:', columnList);
    return columnList;
}


function setAllColumns(fullData) {
    var count = fullData.length;
    var barChartArray = [
    	setTableHeader(count)
    ];
    // console.log('columns data :', fullData);
    for (var i=0; i<count; i++) {
    	var column = setColumn(fullData[i], 5);
    	barChartArray.push(column);
    }
    return barChartArray;
}


function drawBarChart(data) {
    	// Define the chart to be drawn.
    var barChartArray = setAllColumns(data);
    console.log('barChartColumnHeader: ', barChartArray);
    var data = google.visualization.arrayToDataTable(barChartArray);
    var chart = new google.visualization.BarChart(document.getElementById('barchart-container'));
    chart.draw(data, barChartOption());
}


// fetch data to draw pie chart
function barChartInit() {

	$.ajax({
        url: '/barChart',
        data: $('form').serialize(),
        type: 'POST',
        success: function(response) {
        	console.log('--------------bar chart response----------');
            console.log(response);
    		drawBarChart(response);
            setSubmitButton(true);
        },
        error: function(error) {
            setSubmitButton(true);
            console.log(error);
        }
    });
}

function showBarChart() {
	google.load("visualization", "1", {packages:["corechart"]});  
    google.charts.setOnLoadCallback(barChartInit);
}



// function drawChartInit() {

// 	var data = google.visualization.arrayToDataTable([
//           ['Date', 'Good', 'Bad'],
//           [11, 3, 2],
//           [12, 5, 3],
//           [23, 9, 2],
//           [32, 6, 3]
//         ]);

//         var view = new google.visualization.DataView(data);

//         view.setColumns([{
// 	            label: 'Date',
// 	            type: 'string',
// 	            calc: function (dt, row) {
// 		                var str = dt.getValue(row, 0);
// 		                return { v: str, f: str.toString() };
// 		            }
// 	        },{
//                  label: 'Good',
//                  type: 'number',
//                  calc: function (dt, row) {
//                      var good = dt.getValue(row, 1);
//                      var bad = dt.getValue(row, 2);
//                      return { v: good / (good + bad), f: good.toString() };
//                  }
//              }, {
//                  label: 'Bad',
//                  type: 'number',
//                  calc: function (dt, row) {
//                      var good = dt.getValue(row, 1);
//                      var bad = dt.getValue(row, 2);
//                      return { v: bad / (good + bad), f: bad.toString() };
//                  }
//              },
//              {
//                  role: 'annotation',
//                  type: 'string',
//                  calc: function (dt, row) {
//                      var good = dt.getValue(row, 1);
//                      var bad = dt.getValue(row, 2);
//                      var perc = (bad / (good + bad)) * 100;
//                      var ann = parseFloat(Math.round(perc).toFixed(2)) + "%";
//                      return { v: ann, f: ann.toString() };
//                  }
//              }]);

//         var options = {
//             title: 'Daily deeds',
//             isStacked: true,
//             vAxis: { format: '#.##%' }
//         };

//         var chart = new google.visualization.ColumnChart(document.getElementById('barchart-container'));
//         chart.draw(view, options);
// }

// function makeBarGraph() {
// 	google.charts.load('current', {'packages':['corechart']});
// 	google.charts.setOnLoadCallback(makeBarGraph);

// 	var data = google.visualization.arrayToDataTable([
//         ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
//          'Western', 'Literature', { role: 'annotation' } ],
//         ['2010', 10, 24, 20, 32, 18, 5, 'SAD'],
//         ['2020', 16, 22, 23, 30, 16, 9, 'DD'],
//         ['2030', 28, 19, 29, 30, 12, 13, 'GD']
//       ]);

//       var options = {
//         width: 600,
//         height: 400,
//         legend: { position: 'top', maxLines: 3 },
//         bar: { groupWidth: '75%' },
//         isStacked: true,
//         legend: 'none'
//       };	
//       var chart = new google.visualization.BarChart(document.getElementById("barcontainer"));
//       chart.draw(data, options)
// }

// function drawChart() {
// 	google.charts.load('current', {packages: ['corechart', 'bar']});
// 	google.charts.setOnLoadCallback(drawStacked);

// 	function drawStacked() {

// 	      var data = new google.visualization.DataTable();
// 	      data.addColumn('timeofday', 'Time of Day');
// 	      data.addColumn('number', 'Motivation Level');
// 	      data.addColumn({type:'string', role:'annotation'});      
// 	      data.addColumn('number', 'Energy Level');
// 	      data.addColumn({type:'string', role:'annotation'});
// 	      data.addColumn('number', 'test Level');
// 	      data.addColumn({type:'string', role:'annotation'});
// 	      data.addColumn('number', 'Motivation Level');
// 	      data.addColumn({type:'string', role:'annotation'});

// 	      data.addRows([
// 	        [{v: [9, 0, 0], f: '8 am'},{v:40,f:"asd"},"aq",{v:40,f:"asd"},"bq",{v:40,f:"asd"},"cq",{v:0},"dq"],
// 	        [{v: [10, 0, 0], f: '8 am'},{v:40,f:"asd"},"lq",{v:40,f:"asd"},"mq",{v:40,f:"asd"},"nq",{v:0},"oq"],
// 	        [{v: [11, 0, 0], f: '8 am'},{v:100,f:"asd"},"wq",{v:40,f:"asd"},"xq",{v:40,f:"asd"},"yq",{v:0},"zq"],
// 	      ]);

// 	      var options = {
// 	        title: 'Motivation and Energy Level Throughout the Day',
// 	        isStacked: true,
// 	        annotations: {
// 	        alwaysOutside : false,
// 	          textStyle: {
// 	            fontSize: 14,
// 	            color: '#000',
// 	            auraColor: 'none'
// 	          }
// 	        },
// 	        hAxis: {
// 	          title: 'Time of Day',
// 	          format: 'h:mm a',
// 	        },
// 	        vAxis: {
// 	          title: 'Rating (scale of 1-10)',
// 	          viewWindow:{
// 	                max:200,
// 	                min:0
// 	              }
// 	        },
// 	        colors: ["blue","red","green","transparent"],
// 	        bar: {groupWidth: "95%"},
// 	      };

// 	      var chart = new google.visualization.ColumnChart(document.getElementById('barcontainer'));
// 	      chart.draw(data, options);
// 	    }
// 	}

// function drawChartLandscape() {
	        
//         var data = new google.visualization.DataTable();
//         data.addColumn('string', 'Period');
//         data.addColumn('number', 'AHMA PS');
//         data.addColumn('number', 'Others PS');
//         data.addColumn('number', 'AHMA AB');
//         data.addColumn('number', 'Others AB');
//         data.addColumn('number', 'AHMA CC');
//         data.addColumn('number', 'Others CC');

//         data.addRows([
//           ['Apr', 30, 50, 10, 60, 2, 40],
//           ['Mar', 30, 2, 10, 60, 2, 40],
//           ['Feb', 30, 50, 10, 60, 2, 40],
//           ['Jan', 30, 50, 10, 60, 2, 40]
//         ]);

//         var view = new google.visualization.DataView(data);

//         view.setColumns([0, 1, {
//             calc: "stringify",
//             sourceColumn: 1,
//             type: "string",
//             role: "annotation"
//         },
//           2, {
//               calc: "stringify",
//               sourceColumn: 2,
//               type: "string",
//               role: "annotation"
//           },
//           3, {
//               calc: "stringify",
//               sourceColumn: 3,
//               type: "string",
//               role: "annotation"
//           },
//           4, {
//               calc: "stringify",
//               sourceColumn: 4,
//               type: "string",
//               role: "annotation"
//           },
//           5, {
//               calc: "stringify",
//               sourceColumn: 5,
//               type: "string",
//               role: "annotation"
//           },
//           6, {
//               calc: "stringify",
//               sourceColumn: 6,
//               type: "string",
//               role: "annotation"
//           }
//         ]);



//         var options = {
//             isStacked: true,
//             series: {
//                 2: {
//                     targetAxisIndex: 1
//                 },
//                 3: {
//                     targetAxisIndex: 1
//                 },
//                 4: {
//                     targetAxisIndex: 2
//                 },
//                 5: {
//                     targetAxisIndex: 2
//                 }
//             },
//             vAxis: {
//                 viewWindow: {
//                     min: 0,
//                     max: 200
//                 }
//             }
//         };
//         var chart = new google.charts.Bar(document.getElementById('barcontainer'));
//         chart.draw(view, options);// google.charts.Bar.convertOptions(options_fullStacked));
// 	        // alert('s');
// }

// // --------------------------------------------------------

// function dataChart() {
// 	Highcharts.chart('container', {
//     chart: {
//         type: 'column',
//          inverted: true
//     },
//     title: {
//         text: 'Stacked column chart'
//     },
//     xAxis: {
//         categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
//     },
//     yAxis: {
//         min: 0,
//         title: {
//             text: 'Total fruit consumption'
//         },
//         stackLabels: {
//             enabled: true,
//             style: {
//                 fontWeight: 'bold',
//                 color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
//             }
//         }
//     },
//     // legend: {
//     //     align: 'right',
//     //     x: -30,
//     //     verticalAlign: 'top',
//     //     y: 25,
//     //     floating: true,
//     //     backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
//     //     borderColor: '#CCC',
//     //     borderWidth: 1,
//     //     shadow: false
//     // },
//     tooltip: {
//         headerFormat: '<b>{point.x}</b><br/>',
//         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
//     },
//     plotOptions: {
//         column: {
//             stacking: 'normal',
//             dataLabels: {
//                 enabled: true,
//                 color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
//             }
//         }
//     },
//     series: [{
//         name: 'John',
//         data: [5, 3, 4, 7, 2]
//     }, {
//         name: 'Jane',
//         data: [2, 2, 3, 2, 1]
//     }, {
//         name: 'Joe',
//         data: [3, 4, 4, 2, 5]
//     }]
// });
// }