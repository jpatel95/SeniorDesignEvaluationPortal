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
  console.log(htmlMap);
});

var teamsMap = [];

//var htmlMap = [];

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

      var csvNoPrefix = csv;
      csvNoPrefix = csvNoPrefix.concat('%0A');

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


        csvNoPrefix = csvNoPrefix.concat(str);
			}

			console.log(csv);

      console.log(csvNoPrefix);

      var noPrefix = decodeURIComponent(csvNoPrefix);
      //we need to decode here so our parsing tool will work
      var t = Papa.parse(noPrefix);
      //t now holds the data in json format
      console.log(t);
      t.data.pop();
      var n=transpose(t.data);
      //n should hold the transposed data in json format
      console.log(n);

      var finalCsv = Papa.unparse(n);
      //finalCsv holds the transposed data in csv format here
      var transAndEncoded = encodeURIComponent(finalCsv);
      console.log(finalCsv);
      console.log(transAndEncoded);

      //this is to download transposed matrix as csv
      transAndEncoded = prefix.concat(transAndEncoded);
      console.log(test);


      //var htmlForNewWindow = "<html>" + write(finalCsv) + "<button id='printpagebutton' onclick='printReport()'>Print Report</button><script>function printReport(){var printButton = document.getElementById('printpagebutton');printButton.style.visibility = 'hidden';window.print();printButton.style.visibility = 'visible';}</script></html>";
      /*pass the transposed csv data to the write function which will format
      the table to be displayed on the new window*/
      //console.log(htmlForNewWindow);

      //push html string to array
      //htmlMap.push(htmlForNewWindow);

			if(obj["Title"] != ""){
        //This was for downloading csv but now we are printing to separate html page
				var htmlString = '<tr><td>'+obj["Title"]+'</td><td>'+ names +'</td><td>'+obj["Session"]+'</td><td><a class="btn-floating waves-effect red darken-4" href="'+transAndEncoded+'" download="team_'+obj["Title"]+'.csv"><i class="material-icons">info</i></a></td></tr>';

        /*This was for printing on separate page
        var htmlString = '<tr><td>'+obj["Title"]+'</td><td>'+ names +'</td><td>'+obj["Session"]+'</td><td><button class="btn-floating waves-effect red darken-4" id="button'+ i +'" onclick="writeTableToNewWindow('+ i +')"><i class="material-icons">info</i></button></td></tr>';
        console.log(htmlString);*/

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

transpose = function(a) {

  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};

function write(data) {
	// start the table
	var html = '<table style="border-collapse:collapse; border: 1px solid black">';

	// split into lines
	var rows = data.split("\n");

	// parse lines
	rows.forEach( function getvalues(ourrow) {

		// start a table row
		html += "<tr style='border: 1px solid black'>";

		// split line into columns
		var columns = ourrow.split(",");

    for (var i = 0; i < columns.length; i++) {
      html += "<td style='border: 1px solid black'>" + columns[i] + "</td>";
    }

		// close row
		html += "</tr>";
	})
	// close table
	html += "</table>";

	return html;
}

function writeTableToNewWindow(index) {
    var data = htmlMap[index];
    var myWindow = window.open("","");
		myWindow.document.write(data);
}

function printReport(){
    var printButton = document.getElementById("printpagebutton");
    printButton.style.visibility = 'hidden';
    window.print()
    printButton.style.visibility = 'visible';
}
