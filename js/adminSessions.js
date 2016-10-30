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
			for(var i=0; i<sessionsMap[session].length; ++i){
				var obj = sessionsMap[session][i];
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
				fullHref=fullHref.concat('%0A', encodeURIComponent('Average Judge Score,'), totalAverage/Object.keys(obj["judgescores"]).length);

			}
			console.log(fullHref);
			var htmlString = '<tr><td>'+obj["Category"]+'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href='+fullHref+' download="session.csv"><i class="material-icons">info</i></a></td></tr>';
			$("#tableBody").append(htmlString);
		}	
	});
}





function populateTableOLD(){
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
			
			//initialize csv if this is the first project from a session
			if(i == 0 || obj["Session"] != teamsMap[i-1]["Session"]){	
				var prefix = 'data:application/octet-stream,';
				var csv = 'Session: '+obj["Session"];
				//var csv = 'Judge,Technical Accuracy,Creativity and Innovation,Supporting Analytical Work,Methodical Design Process Dem,Addresses Project Complexity,Completeness,Design & Analysis of Tests,Quality of Response During Q&A,Organization,Time Allotment,Visual Aids,Confidence and Poise,Comments';
				csv = prefix.concat(encodeURIComponent(csv.trim()),'%0A');
				
				string = 'Session Scoring Summary By Title'+','+'Average Score';
				string = encodeURIComponent(string.trim()).concat('%0A');
				csv=csv.concat(string);
				var temp = i;
				var total = 0;
				var avg = 0;
				
				//print team names and average score at the top of the csv
				//NOTE: this is not currently working for different sessions.  My condition to make sure its the same session seems to break the while loop: teamsMap[i]["Session"] == teamsMap[i-1]["Session"]
				while(i < (teamsMap.length)){
					
					//sum the total scores from all judges for this team
					for(var k in (teamsMap[i]["judgescores"])){ 
						var scoreObj = teamsMap[i]["judgescores"][k]
						total = total + (parseInt(scoreObj["score"]['Technical Accuracy'])+parseInt(scoreObj["score"]['Creativity and Innovation'])+parseInt(scoreObj["score"]['Supporting Analytical Work'])+parseInt(scoreObj["score"]['Methodical Design Process Dem'])+parseInt(scoreObj["score"]['Addresses Project Complexity'])+parseInt(scoreObj["score"]['Completeness'])+parseInt(scoreObj["score"]['Design & Analysis of Tests'])+parseInt(scoreObj["score"]['Quality of Response During Q&A'])+parseInt(scoreObj["score"]['Organization'])+parseInt(scoreObj["score"]['Time Allotment'])+parseInt(scoreObj["score"]['Visual Aids'])+parseInt(scoreObj["score"]['Confidence and Poise']));
					}
					avg = total / Object.keys(teamsMap[i]["judgescores"]).length;
					string = teamsMap[i]["Title"]+','+avg;
					string = encodeURIComponent(string.trim()).concat('%0A');
					csv=csv.concat(string);
					i++;
				}

				i = temp;
				//insert blank line
				var string = '';
				string = encodeURIComponent(string.trim()).concat('%0A');
				csv=csv.concat(string);
				string = '';
				string = encodeURIComponent(string.trim()).concat('%0A');
				csv=csv.concat(string);
				
				string = 'Individual Presentation Scores';
				string = encodeURIComponent(string.trim()).concat('%0A');
				csv=csv.concat(string);
				
				string = '';
				string = encodeURIComponent(string.trim()).concat('%0A');
				csv=csv.concat(string);
			}
			var string = teamsMap[i]["Title"];
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = 'Number of Judges Reporting Scores'+','+Object.keys(obj["judgescores"]).length;
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = '';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = 'Judge,Total Score,Technical Accuracy,Creativity and Innovation,Supporting Analytical Work,Methodical Design Process Dem,Addresses Project Complexity,Completeness,Design & Analysis of Tests,Quality of Response During Q&A,Organization,Time Allotment,Visual Aids,Confidence and Poise,Comments';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			var avgCalc = 0;
			for(var j in obj["judgescores"]){
				var scoreObj2 = obj["judgescores"][j];
				var totalScore = (parseInt(scoreObj["score"]['Technical Accuracy'])+parseInt(scoreObj["score"]['Creativity and Innovation'])+parseInt(scoreObj["score"]['Supporting Analytical Work'])+parseInt(scoreObj["score"]['Methodical Design Process Dem'])+parseInt(scoreObj["score"]['Addresses Project Complexity'])+parseInt(scoreObj["score"]['Completeness'])+parseInt(scoreObj["score"]['Design & Analysis of Tests'])+parseInt(scoreObj["score"]['Quality of Response During Q&A'])+parseInt(scoreObj["score"]['Organization'])+parseInt(scoreObj["score"]['Time Allotment'])+parseInt(scoreObj["score"]['Visual Aids'])+parseInt(scoreObj["score"]['Confidence and Poise'])); 
				avgCalc = avgCalc + totalScore;
				var str = scoreObj2['judgename']+','+totalScore+','+scoreObj2["score"]['Technical Accuracy']+','+scoreObj2["score"]['Creativity and Innovation']+','+scoreObj2["score"]['Supporting Analytical Work']+','+scoreObj2["score"]['Methodical Design Process Dem']+','+scoreObj2["score"]['Addresses Project Complexity']+','+scoreObj2["score"]['Completeness']+','+scoreObj2["score"]['Design & Analysis of Tests']+','+scoreObj2["score"]['Quality of Response During Q&A']+','+scoreObj2["score"]['Organization']+','+scoreObj2["score"]['Time Allotment']+','+scoreObj2["score"]['Visual Aids']+','+scoreObj2["score"]['Confidence and Poise']+',"'+scoreObj2["score"]['Comments']+'"';
				str = encodeURIComponent(str.trim()).concat('%0A');
				csv=csv.concat(str);
			}
			string = '';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = 'Average Judge Score'+','+(avgCalc/Object.keys(obj["judgescores"]).length);
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = '';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			string = '';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			//add table entry if this is the last team in the current session
			if(i == (teamsMap.length-1) || teamsMap[i+1]["Session"] != obj["Session"]){
				var htmlString = '<tr><td>'+obj["Category"]+'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href='+csv+' download="session.csv"><i class="material-icons">info</i></a></td></tr>';
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