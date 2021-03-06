(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);

$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (!user) {
			console.log("Not Signed in");
			window.location.replace("../index.html");
		}
	})
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
	$("#csv-file").change(handleFileSelect);
    document.getElementById("addJudge").addEventListener("click", addJudge);
    document.getElementById("removeJudge").addEventListener("click", removeJudge);
    document.getElementById("forgotCode").addEventListener("click", forgotCode);
    document.getElementById("deleteAllTeamsBtn").addEventListener("click", deleteAllTeams);
});

function logout(){
	if (firebase.auth().currentUser) {
		console.log("Logging out now");
		firebase.auth().signOut();
	}
	window.location.replace("../index.html");
}


function addJudge(){
	//the regex in .replace will sanitize input
	var firstName = (document.getElementById("firstNameAdd").value).replace(/<\/?[^>]+(>|$)/g, "");
	var lastName = (document.getElementById("lastNameAdd").value).replace(/<\/?[^>]+(>|$)/g, "");
	
	var fullName = firstName +" "+lastName;
	console.log(fullName);

	var code = generateCode();
	console.log(code);

	var ref = firebase.database().ref("judges");
	result = ref.push({
        code:code,
        name:fullName
    });
    setTimeout(function(){},1000);

    console.log(result);
    document.getElementById("firstNameAdd").value = "";
	document.getElementById("lastNameAdd").value = "";
	
	//Ask user to copy the Judge ID manually	
	window.prompt("Copy to clipboard: Ctrl+C (PC) or Cmd+C (MAC), Enter",code);
}

function removeJudge(){
	//the regex in .replace will sanitize input
	var firstName = (document.getElementById("firstNameRemove").value).replace(/<\/?[^>]+(>|$)/g, "");
	var lastName = (document.getElementById("lastNameRemove").value).replace(/<\/?[^>]+(>|$)/g, "");
	
	var fullName = firstName +" "+lastName;
	console.log(fullName);


	var ref = firebase.database().ref("judges");
	var result = ref.once("value").then(function(snapshot) {
		console.log(snapshot.val());
		var key = snapshot.forEach(function(childSnapshot) {
		    var childData = childSnapshot.val();
		    console.log(key, childData);
		    if(fullName == childData.name){
		      console.log("Match Found: " + childSnapshot.key);
		      ref.child(childSnapshot.key).remove();
		      return childSnapshot.key;
		    }
		});
		console.log(key);
		alert("Deleted.");
	});

	document.getElementById("firstNameRemove").value = "";
	document.getElementById("lastNameRemove").value = "";
}

function forgotCode(){
	//the regex in .replace will sanitize input
	var firstName = (document.getElementById("firstNameForgot").value).replace(/<\/?[^>]+(>|$)/g, "");
	var lastName = (document.getElementById("lastNameForgot").value).replace(/<\/?[^>]+(>|$)/g, "");
	
	var fullName = firstName +" "+lastName;
	console.log(fullName);


	var ref = firebase.database().ref("judges");
	var result = ref.once("value").then(function(snapshot) {
		console.log(snapshot.val());
		var isMatch = snapshot.forEach(function(childSnapshot) {
		    var childData = childSnapshot.val();
		    if(fullName == childData.name){
		      console.log("Match Found: " + childData.code);
		      alert(childData.code);
		      return true;
		    }
		});
		if(isMatch==false){
			alert("No user found.");
		}
	});

	document.getElementById("firstNameForgot").value = "";
	document.getElementById("lastNameForgot").value = "";
}


function generateCode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    for(var i=0; i < 6; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}



function checkIfCodeExists(pass){
	var ref = firebase.database().ref("judges");
	var result = ref.once("value").then(function(snapshot) {
		console.log(snapshot.val());
		isMatch = snapshot.forEach(function(childSnapshot) {
		    var key = childSnapshot.key;
		    var childData = childSnapshot.val();
		    console.log(key, childData);
		    if(pass == childData.code){
		      console.log("Match Found: " + pass);
		      return true;
		    }
		});
		if(isMatch==true){
			console.log("Match Found");
			return true;
		} else {
			console.log("Match Not Found");
			return false;
		}
	});
	console.log(result);
}


function handleFileSelect(evt) {
  var data;
  console.log(evt.target.files);
  var file = evt.target.files[0];
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      data = results;
      console.log(data.data);
      delete data[''];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        for(var key in obj){
          if(key==''){
            delete obj[key];
          } else if(key.search('[.#$/]')!=-1){
            var value = obj[key];
            delete obj[key];
            key = key.replace('[.#$/]', '');
            obj[key] = value;
          }
        }

        console.log(data.data[i]);
        var ref = firebase.database().ref("roster");
        ref.push(data.data[i]);
      }
 	  alert("Teams Uploaded.");
    }
  });
}



function deleteAllTeams(){
	console.log("Deleted");
	var ref = firebase.database().ref("roster");
	ref.remove();
	alert("Deleted.");
}
