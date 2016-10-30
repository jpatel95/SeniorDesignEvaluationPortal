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
	// populateTableOLD();
});

var sessionsMap = {};
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
		document.getElementById("tableDiv").innerHTML = '<table class="centered"><thead><tr><th data-field="department">Department</th><th data-field="session">Session</th><th data-field="buttonSessionReport">SessionReport</th></tr></thead><tbody id="tableBody"></tbody></table>';		
		
		for(var i=0; i<teamsMap.length; i++){
			var obj = teamsMap[i];
			if(sessionsMap[obj.Session]==null){
				sessionsMap[obj.Session] = [];
			}
			sessionsMap[obj.Session].push(obj);
		}

		var csvHeader = "".concat(encodeURIComponent('Judge,TotalScore,Average Score,Technical Accuracy,Creativity and Innovation,Supporting Analytical Work,Methodical Design Process Dem,Addresses Project Complexity,Completeness,Design & Analysis of Tests,Quality of Response During Q&A,Organization,Time Allotment,Visual Aids,Confidence and Poise,Comments'), '%0A');
		for(var session in sessionsMap){
			var prefix = 'data:application/octet-stream,' + encodeURIComponent('Session,'.concat(session)) + '%0A';
			var fullHref = prefix;
			var scoringSummary = {};
			for(var i=0; i<sessionsMap[session].length; ++i){
				var obj = sessionsMap[session][i];
				if(scoringSummary[obj.Title]==null){
					scoringSummary[obj.Title] = 0;
				}

				var totalAverage = 0;
				var countJudges = 0;
				fullHref = fullHref.concat(encodeURIComponent('Individual Presentation Scores'), '%0A', encodeURIComponent("Presentation Name,"), encodeURIComponent(obj.Title), '%0A', encodeURIComponent("Number of Judges Reporting Scores,"), Object.keys(sessionsMap[session][i]["judgescores"]).length, '%0A%0A', csvHeader);
				for (var key2 in obj["judgescores"]) {
					var scoreObj = obj["judgescores"][key2];
					var totalScore = 0;
					for(var key3 in scoreObj["score"]){
						if(key3!="Comments" && key3!='Considerations Addressed'){
							totalScore += parseInt(scoreObj["score"][key3]);
						}
					}
					//Totalscore/12 because 12 grading fields.
					var curAverage = totalScore/(12);
					totalAverage += curAverage;
					var str = scoreObj['judgename']+','+totalScore+','+curAverage+','+scoreObj["score"]['Technical Accuracy']+','+scoreObj["score"]['Creativity and Innovation']+','+scoreObj["score"]['Supporting Analytical Work']+','+scoreObj["score"]['Methodical Design Process Dem']+','+scoreObj["score"]['Addresses Project Complexity']+','+scoreObj["score"]['Completeness']+','+scoreObj["score"]['Design & Analysis of Tests']+','+scoreObj["score"]['Quality of Response During Q&A']+','+scoreObj["score"]['Organization']+','+scoreObj["score"]['Time Allotment']+','+scoreObj["score"]['Visual Aids']+','+scoreObj["score"]['Confidence and Poise']+',"'+scoreObj["score"]['Comments']+'"';
					str = encodeURIComponent(str.trim()).concat('%0A');
					fullHref=fullHref.concat(str);
				}
				totalAverage = totalAverage/Object.keys(obj["judgescores"]).length;
				scoringSummary[obj.Title] = totalAverage;
				fullHref=fullHref.concat('%0A', encodeURIComponent('Average Judge Score,'), totalAverage);
			}
			var summary = '%0A%0A'.concat(encodeURIComponent('Average Scores By Team'), '%0A');
			for(var key in scoringSummary){
				summary = summary.concat(encodeURIComponent(key),',', scoringSummary[key], '%0A');
			}
			fullHref = fullHref.concat(summary);
			// console.log(fullHref);
			var htmlString = '<tr><td>'+obj["Category"]+'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href='+fullHref+' download="session.csv"><i class="material-icons">info</i></a></td></tr>';
			$("#tableBody").append(htmlString);
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