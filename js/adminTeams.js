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

	var ref = firebase.database().ref("roster");
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
			var csv = encodeURIComponent('Judge,Total Score,Technical Accuracy,Creativity and Innovation,Supporting Analytical Work,Methodical Design Process Dem,Addresses Project Complexity,Completeness,Design & Analysis of Tests,Quality of Response During Q&A,Organization,Time Allotment,Visual Aids,Confidence and Poise,Considerations Addressed,Comments');
			csv = prefix.concat(csv, '%0A');

			for (var key2 in obj["judgescores"]) {
				var scoreObj = obj["judgescores"][key2];

				var totalScore = 0;
				for(var key3 in scoreObj["score"]){
					if(key3!="Comments" && key3!='Considerations Addressed'){
						totalScore += parseInt(scoreObj["score"][key3]);
					}
				}

				console.log("Score Found: " + key2);
				console.log(scoreObj);
				var considerations = '';
				for(var index in scoreObj["score"]['Considerations Addressed']){
					considerations = considerations.concat(scoreObj["score"]['Considerations Addressed'][index], ' and ');
				}
				considerations = considerations.substring(0, considerations.length-5);
				var str = scoreObj['judgename']+','+totalScore+','+scoreObj["score"]['Technical Accuracy']+','+scoreObj["score"]['Creativity and Innovation']+','+scoreObj["score"]['Supporting Analytical Work']+','+scoreObj["score"]['Methodical Design Process Dem']+','+scoreObj["score"]['Addresses Project Complexity']+','+scoreObj["score"]['Completeness']+','+scoreObj["score"]['Design & Analysis of Tests']+','+scoreObj["score"]['Quality of Response During Q&A']+','+scoreObj["score"]['Organization']+','+scoreObj["score"]['Time Allotment']+','+scoreObj["score"]['Visual Aids']+','+scoreObj["score"]['Confidence and Poise']+',"'+ considerations +'","'+scoreObj["score"]['Comments']+'"';
				str = encodeURIComponent(str.trim()).concat('%0A');
				csv=csv.concat(str);
			}

			console.log(csv);

			if(obj["Title"] != ""){
				var htmlString = '<tr><td>'+obj["Title"]+'</td><td>'+ names +'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href="'+csv+'" download="team_'+obj["Title"]+'.csv"><i class="material-icons">info</i></a></td></tr>';
				$("#tableBody").append(htmlString);
			}
		}
	});
}

function logout(){
	if (firebase.auth().currentUser) {
		console.log("Logging out now");
		firebase.auth().signOut();
	}
	window.location.replace("../index.html");
}

