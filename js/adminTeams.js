(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);


$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		  console.log("Already Signed in");
		} else {
		  console.log("Not Signed in");
		  window.location.replace("../index.html");
		}
	})
});


function logout(){
	if (firebase.auth().currentUser) {
		console.log("Logging out now");
		firebase.auth().signOut();
	}
	window.location.replace("../index.html");
}