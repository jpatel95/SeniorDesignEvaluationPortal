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
              '<input id="password" type="password" class="validate" required>' +
              '<label for="password">Code</label>' +
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
  if (firebase.auth().currentUser) {
    console.log("You were already signed in so logging out now");
    console.log(firebase.auth().currentUser.uid);
    firebase.auth().signOut();
  }
  /*
  Need to add input sanitization.
  */
  if(isAdminSelected){
      email = document.getElementById("email").value;
      pass = document.getElementById("password").value;
      loginAdminImpl(email, pass);
  } else {
      pass = document.getElementById("password").value;
      loginJudgeImpl(pass);
  }
}

function loginAdminImpl(email, pass){
  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    alert("Invalid credentials");
  });

  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      window.location.replace("adminSessions.html");
    }
  });
}

function loginJudgeImpl(pass){
  $( "#loginButtonRow" ).append('<div id="loader" class="preloader-wrapper active">' +
    '<div class="spinner-layer spinner-red-only">' +
      '<div class="circle-clipper left">' +
        '<div class="circle"></div>' +
      '</div><div class="gap-patch">' +
        '<div class="circle"></div>' +
      '</div><div class="circle-clipper right">' +
        '<div class="circle"></div>' +
      '</div>' +
    '</div>' +
  '</div>');

  var ref = firebase.database().ref("judges");
  ref.once("value").then(function(snapshot) {
    console.log(snapshot.val());
    isMatch = snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        console.log(key, childData);
        if(pass == childData.code){
          console.log("Match Found: " + pass);
          localStorage.setItem("code", childData.code);
          localStorage.setItem("name", childData.name);
          return true;
        }
    });
    if(isMatch==true){
      console.log("Matched");
      window.location.replace("judgeEvaluation.html");
    } else {
      alert("Invalid code");
      console.log("did not match");
      $("#loader" ).remove();
    }
  });
}



