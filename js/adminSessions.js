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
					for(var k = 0; k<teamsMap[i]["judgescores"].length; k++){ 
						var scoreObj = teamsMap[i]["judgescores"][k]
						total = total + (scoreObj["score"]['Technical Accuracy']+scoreObj["score"]['Creativity and Innovation']+scoreObj["score"]['Supporting Analytical Work']+scoreObj["score"]['Methodical Design Process Dem']+scoreObj["score"]['Addresses Project Complexity']+scoreObj["score"]['Completeness']+scoreObj["score"]['Design & Analysis of Tests']+scoreObj["score"]['Quality of Response During Q&A']+scoreObj["score"]['Organization']+scoreObj["score"]['Time Allotment']+scoreObj["score"]['Visual Aids']+scoreObj["score"]['Confidence and Poise']);
					}
					avg = total / teamsMap[i]["judgescores"].length;
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
			
			string = 'Number of Judges Reporting Scores'+','+obj["judgescores"].length;
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = '';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = 'Judge,Total Score,Technical Accuracy,Creativity and Innovation,Supporting Analytical Work,Methodical Design Process Dem,Addresses Project Complexity,Completeness,Design & Analysis of Tests,Quality of Response During Q&A,Organization,Time Allotment,Visual Aids,Confidence and Poise,Comments';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			var avgCalc = 0;
			for(var j = 0; j<obj["judgescores"].length; j++){
				var scoreObj2 = obj["judgescores"][j];
				var totalScore = (scoreObj["score"]['Technical Accuracy']+scoreObj["score"]['Creativity and Innovation']+scoreObj["score"]['Supporting Analytical Work']+scoreObj["score"]['Methodical Design Process Dem']+scoreObj["score"]['Addresses Project Complexity']+scoreObj["score"]['Completeness']+scoreObj["score"]['Design & Analysis of Tests']+scoreObj["score"]['Quality of Response During Q&A']+scoreObj["score"]['Organization']+scoreObj["score"]['Time Allotment']+scoreObj["score"]['Visual Aids']+scoreObj["score"]['Confidence and Poise']); 
				avgCalc = avgCalc + totalScore;
				var str = scoreObj2['judgename']+','+totalScore+','+scoreObj2["score"]['Technical Accuracy']+','+scoreObj2["score"]['Creativity and Innovation']+','+scoreObj2["score"]['Supporting Analytical Work']+','+scoreObj2["score"]['Methodical Design Process Dem']+','+scoreObj2["score"]['Addresses Project Complexity']+','+scoreObj2["score"]['Completeness']+','+scoreObj2["score"]['Design & Analysis of Tests']+','+scoreObj2["score"]['Quality of Response During Q&A']+','+scoreObj2["score"]['Organization']+','+scoreObj2["score"]['Time Allotment']+','+scoreObj2["score"]['Visual Aids']+','+scoreObj2["score"]['Confidence and Poise']+',"'+scoreObj2["score"]['Comments']+'"';
				str = encodeURIComponent(str.trim()).concat('%0A');
				csv=csv.concat(str);
			}
			string = '';
			string = encodeURIComponent(string.trim()).concat('%0A');
			csv=csv.concat(string);
			
			string = 'Average Judge Score'+','+(avgCalc/obj["judgescores"].length);
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
				var htmlString = '<tr><td>'+obj["Category"]+'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href='+csv+'><i class="material-icons">info</i></a></td></tr>';
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