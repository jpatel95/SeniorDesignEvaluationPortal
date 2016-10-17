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
    firebase.auth().signOut();
  }

  if(isAdminSelected){
    //Need to figue out admin auth!!!


    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      return;
    });
  } else {
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      return;
    });
  }
  

  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      if(isAdminSelected){
        window.location.replace("adminSessions.html");
      } else {
        window.location.replace("judgeEvaluation.html");
      }
    }
  });
}






