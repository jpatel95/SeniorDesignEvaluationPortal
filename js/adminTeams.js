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
	populateTable();
});

var teamsMap = [];

function populateTable(){
	console.log("populating data");
	$( "#tableDiv" ).append('<div id="loader" class="preloader-wrapper active">' +
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
	
	var ref = firebase.database().ref("teams");
	ref.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			teamsMap.push(childSnapshot.val());
		});
		$("#loader" ).remove();
		console.log(teamsMap);
		document.getElementById("tableDiv").innerHTML = '<table class="centered"><thead><tr><th data-field="nameOfTeam">Senior Design Team</th><th data-field="nameOfMembers">Members</th><th data-field="Session">Session</th><th data-field="buttonTeamReport">TeamReport</th></tr></thead><tbody id="tableBody"></tbody></table>';		
		for(var i=0; i<teamsMap.length; i++){
			var obj = teamsMap[i];

			var names = "";
			for(var j=1;j<7;j++){
				if(obj["First " + j] != ""){
					names = names.concat(obj["First " + j] + " " + obj["Last " + j] + ", ");
				}
			}
			names = names.substring(0, names.length-2);

			var prefix = 'data:application/octet-stream,';
			var csv = 'Judge,Technical Accuracy,Creativity and Innovation,Supporting Analytical Work,Methodical Design Process Dem,Addresses Project Complexity,Completeness,Design & Analysis of Tests,Quality of Response During Q&A,Organization,Time Allotment,Visual Aids,Confidence and Poise,Comments';
			csv = prefix.concat(encodeURIComponent(csv.trim()),'%0A');

			for(var j = 0; j<obj["judgescores"].length; j++){
				var scoreObj = obj["judgescores"][j];
				var str = scoreObj['judgename']+','+scoreObj["score"]['Technical Accuracy']+','+scoreObj["score"]['Creativity and Innovation']+','+scoreObj["score"]['Supporting Analytical Work']+','+scoreObj["score"]['Methodical Design Process Dem']+','+scoreObj["score"]['Addresses Project Complexity']+','+scoreObj["score"]['Completeness']+','+scoreObj["score"]['Design & Analysis of Tests']+','+scoreObj["score"]['Quality of Response During Q&A']+','+scoreObj["score"]['Organization']+','+scoreObj["score"]['Time Allotment']+','+scoreObj["score"]['Visual Aids']+','+scoreObj["score"]['Confidence and Poise']+',"'+scoreObj["score"]['Comments']+'"';
				str = encodeURIComponent(str.trim()).concat('%0A');
				csv=csv.concat(str);
			}

			console.log(csv);


			//EXAMPLE CSV!
			//data:application/octet-stream,field1%2Cfield2%0Afoo%2Cbar%0Agoo%2Cgai%0A"
			// <a href=">CSV</a>
			var htmlString = '<tr><td>'+obj["Title"]+'</td><td>'+ names +'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href='+csv+'><i class="material-icons">info</i></a></td></tr>';
			$("#tableBody").append(htmlString);
		}
	});
}

function downloadCSV(index){

}

function logout(){
	if (firebase.auth().currentUser) {
		console.log("Logging out now");
		firebase.auth().signOut();
	}
	window.location.replace("../index.html");
}

