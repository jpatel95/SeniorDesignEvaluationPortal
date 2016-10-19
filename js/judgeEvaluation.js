(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);

$(document).ready(function() {
	var name = localStorage.getItem("name");
	var code = localStorage.getItem("code");
	console.log(name, code);
	$('select').material_select();
	$("#welcomeHeader").append("Hello " + name.split(" ")[0] + ". Thank you for being with us today.");
});

function logout(){
	console.log("Logging out now");
	localStorage.removeItem("name");
	localStorage.removeItem("code");
	window.location.replace("../index.html");
}
