(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);


$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			if(isAdminSelected){
				var ref = firebase.database().ref("admins/uid");
				ref.once("value").then(function(snapshot) {
					console.log(snapshot.val());
					if(firebase.auth().currentUser.uid == snapshot.val()){
						console.log("Matched with admin");
					} else {
						alert("Credentials do not match admin");
						window.location.replace("../index.html");
					}
				});
			} 
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