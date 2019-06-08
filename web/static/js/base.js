// $("#waitngView").toggle();

function display(txt="This is an alert!") {
    alert(txt);
}

// $('div.pieC').on('click', function (event) {
//  	console.log('cscassadsd');
// 	if (event.target != this) {
// 	    alert('You clicked a descendent of #container.');
// 	} else {
// 	    alert('You actually clicked #container itself.');
// 	}
// });


$('div.pieC').bind('click', $.proxy(function(event) {	
    var status = $(event.currentTarget).attr('id');
    alert(status);
}, this));

// $('[class=pieChartUnit]').click(function(e){
// 	e.stopPropagation();
//     var class_name = $(this).attr('id');
//     alert(class_name);
// });


function setSubmitButton(isEnable) {
	// (dis)enable submit button
	document.getElementById("submitBtn").style.opacity = isEnable ? "1.0" : "0.3"; 
	// $(".formSubmite").attr("disabled", isEnable==false);
	document.getElementById("submitBtn").disabled = (isEnable==false);
	// show/hide wating indicator
	var wating = document.getElementById("waitngView");
	if (wating != null) {
		// console.log("wating.style.display:", wating.style.display);
		wating.style.display = isEnable ? "none" : "block";
		// console.log("wating.style.display now:", wating.style.display);
	}  
}

// when manualy 'submit' pressed
$(function() {
	$('form').on('submit', function(e) {
        setSubmitButton(false);
        console.log("shwoing please wait...");
        // showDummyPieChart();
        showPieChart();
        // showBarChart();
		e.preventDefault();
	});
});



