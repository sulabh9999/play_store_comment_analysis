// $("#waitngView").toggle();

function display(txt="This is an alert!") {
    alert(txt);
}

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
        showBarChart();
		e.preventDefault();
	});
});



