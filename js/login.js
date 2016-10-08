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
	if(isAdminSelected){
		window.location.replace("adminSessions.html");
	} else {
		window.location.replace("judgeEvaluation.html");
	}

}