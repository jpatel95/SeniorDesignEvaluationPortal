(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);

$(document).ready(function() {
	var name = localStorage.getItem("name");
	var code = localStorage.getItem("code");
	console.log(name, code);
	$('select').material_select();
	$("#welcomeHeader").append("Hello " + name.split(" ")[0] + ". Thank you for being with us today.");
});

function logout(){
	console.log("Logging out now");
	localStorage.removeItem("name");
	localStorage.removeItem("code");
	window.location.replace("../index.html");
}

$("#submit").click(function(){

  var name = localStorage.getItem("name");

  var scores = {
      "Department": $("#department").val(),
      "Session": $("#session").val(),
      "Project Title": $("#projectTitle").val(),
      "Advisor": $("#nameAdvisor").val(),
      "first_name1": $("#first_name1").val(),
      "last_name1": $("#last_name1").val(),
      "first_name2": $("#first_name2").val(),
      "last_name2": $("#last_name2").val(),
      "first_name3": $("#first_name3").val(),
      "last_name3": $("#last_name3").val(),
      "first_name4": $("#first_name4").val(),
      "last_name4": $("#last_name4").val(),
      "first_name5": $("#first_name5").val(),
      "last_name5": $("#last_name5").val(),

      "Technical Accuracy": $("#technical").val(),
      "Creativity and Innovation": $("#creativity").val(),
      "Supporting Analytical Work": $("#supporting").val(),
      "Methodical Design Process Dem": $("#methodical").val(),
      "Addresses Project Complexity": $("#addresses").val(),
      "Completeness": $("#expectation").val(),
      "Design & Analysis of Tests": $("#design").val(),
      "Quality of Response During Q&A": $("#quality").val(),
      "Organization": $("#organization").val(),
      "Time Allotment": $("#time").val(),
      "Visual Aids": $("#visual").val(),
      "Confidence and Poise": $("#confidence").val(),

      "Considerations Addressed": $("#considerations").val(),
      "Comments": $("#textarea1").val()

    };

    //console.log(scores);

    var eval = {
      "judgename": name,
      "score": scores
    };
    console.log(eval);

    var ref = firebase.database().ref("teams");
    ref.once("value").then(function(snapshot) {
      //here snapshot.val() is array of teams
      console.log(snapshot.val());
      //found will be true if project title is in firebase
      var found = snapshot.forEach(function(childSnapshot) {
          //put each team object into childData
          var childData = childSnapshot.val();
          console.log(childData);
          if($("#projectTitle").val() == childData.Title){
            console.log("Match Found at Key: " + childSnapshot.key);
            var reference = firebase.database().ref("teams/" + childSnapshot.key + "/judgescores");
            console.log(reference);
            //reference.push(eval);
            //returning true will stop looping through teams
            return true;
          }
      });

    });

});
