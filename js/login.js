(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);

isAdminSelected = false;

function buttonJudgeClick() {
	console.log("Judge clicked");
	if(!isAdminSelected){
		return;
	}
	document.getElementById("loginButtonRow").innerHTML = '<div class="col s6"><button class="btn waves-effect red darken-4" onClick="buttonJudgeClick()" id="buttonJudge">Judge</button></div><div class="col s6"><button class="btn waves-effect red lighten-3" onClick="buttonAdminClick()" id="buttonAdmin">Admin</button></div>';
    document.getElementById("loginForm").innerHTML = '<div class="row">' +
            '<div class="input-field col s12">' +
             '<input id="email" type="email" class="validate" required>' +
              '<label for="email" data-error="Invalid Data" data-success="right">Email</label>' +
            '</div>' +
          '</div>' +
          '<div class="row">' +
            '<div class="input-field col s12">' +
              '<input id="password" type="password" class="validate" required>' +
              '<label for="password">Password</label>' +
            '</div>' +
          '</div>' +
          '<div class="row center">' +
            '<button class="btn waves-effect red darken-4" type="submit" name="login">Login' +
              '<i class="material-icons right">send</i>' +
            '</button>' +
          '</div>';
    isAdminSelected = false;
};

function buttonAdminClick() {
	console.log("Admin clicked");
	if(isAdminSelected){
		return;
	}
	document.getElementById("loginButtonRow").innerHTML = '<div class="col s6"><button class="btn waves-effect red lighten-3" onClick="buttonJudgeClick()" id="buttonJudge">Judge</button></div><div class="col s6"><button class="btn waves-effect red darken-4" onClick="buttonAdminClick()" id="buttonAdmin">Admin</button></div>';
	document.getElementById("loginForm").innerHTML = '<div class="row">' +
            '<div class="input-field col s12">' +
             '<input id="email" type="email" class="validate" required>' +
              '<label for="email" data-error="Invalid Data" data-success="right">Email</label>' +
            '</div>' +
          '</div>' +
          '<div class="row">' +
            '<div class="input-field col s12">' +
              '<input id="password" type="password" class="validate" required>' +
              '<label for="password">Password</label>' +
            '</div>' +
          '</div>' +
          '<div class="row center">' +
            '<button class="btn waves-effect red darken-4" type="submit" name="login">Login' +
              '<i class="material-icons right">send</i>' +
            '</button>' +
          '</div>';
    isAdminSelected = true;
};

function login(){
	console.log("login clicked");
  /*
  Need to add input sanitization.
  */


  email = document.getElementById("email").value;
  pass = document.getElementById("password").value;
  loginImpl(email, pass);
}

function loginImpl(email, pass){
  if (firebase.auth().currentUser) {
    console.log("You were already signed in so logging out now");
    console.log(firebase.auth().currentUser.uid);
    firebase.auth().signOut();
  }

  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    alert("Invalid credentials");
  });

  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      if(isAdminSelected){
        var ref = firebase.database().ref("admins/uid");
        ref.once("value").then(function(snapshot) {
          console.log(snapshot.val());
          if(firebase.auth().currentUser.uid == snapshot.val()){
            console.log("Matched");
            window.location.replace("adminSessions.html");
          } else {
            alert("Invalid credentials");
          }
        });
      } else {
        window.location.replace("judgeEvaluation.html");
      }
    }
  });
}






