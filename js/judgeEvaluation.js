(function($){
  $(function(){
    $('.button-collapse').sideNav();
  });
})(jQuery);

$(document).ready(function() {
	var name = localStorage.getItem("name");
	var code = localStorage.getItem("code");
	console.log(name, code);
	if(name==null || code==null){
		logout();
	}
	$('select').material_select();
	$("#welcomeHeader").append("Hello, " + name.split(" ")[0] + ". Thank you for being with us today.");
});

function logout(){
	console.log("Logging out now");
	localStorage.removeItem("name");
	localStorage.removeItem("code");
	window.location.replace("../index.html");
}

$("#submit").click(function(){

    if(!$('#selectDepartment').val()){
      alert("Please select a Department");
      return;
    }
    else if (!$('#selectSession').val()) {
      alert("Please select a Session");
      return;
    }
    else if (!$('#selectTime').val()) {
      alert("Please select a time");
      return;
    }
    else if(!$('input[name=technical]:checked').length){
      alert("Please give a score for Technical Accuracy")
      return;
    }
    else if (!$('input[name=creativity]:checked').length) {
      alert("Please give a score for Creativity and Innovation");
      return;
    }
    else if (!$('input[name=supporting]:checked').length) {
      alert("Please give a score for Supporting Analytical Work");
      return;
    }
    else if (!$('input[name=methodical]:checked').length) {
      alert("Please give a score for Methodical Design Process Dem");
      return;
    }
    else if (!$('input[name=addresses]:checked').length) {
      alert("Please give a score for Addresses Project Complexity");
      return;
    }
    else if (!$('input[name=expectation]:checked').length) {
      alert("Please give a score for Completeness");
      return;
    }
    else if (!$('input[name=design]:checked').length) {
      alert("Please give a score for Design & Analysis of Tests");
      return;
    }
    else if (!$('input[name=quality]:checked').length) {
      alert("Please give a score for Quality of Response During Q&A");
      return;
    }
    else if (!$('input[name=organization]:checked').length) {
      alert("Please give a score for Organization");
      return;
    }
    else if (!$('input[name=time]:checked').length) {
      alert("Please give a score for Time Allotment");
      return;
    }
    else if (!$('input[name=visual]:checked').length) {
      alert("Please give a score for Visual Aids");
      return;
    }
    else if (!$('input[name=confidence]:checked').length) {
      alert("Please give a score for Confidence and Poise");
      return;
    }
    else if(!$('#considerations').val().length){
      alert("Please select one or more considerations addressed");
      return;
    }

    /*var $radios = $(".card");
    if($radios.find("input:radio:checked").length === $radios.length) {
      // All Checked
    }
    else {
      alert("Form not completely filled out");
      return;
    }*/

  	var name = localStorage.getItem("name");

    var scores = {
      "Technical Accuracy": $("input[name=technical]:checked").val(),
      "Creativity and Innovation": $("input[name=creativity]:checked").val(),
      "Supporting Analytical Work": $("input[name=supporting]:checked").val(),
      "Methodical Design Process Dem": $("input[name=methodical]:checked").val(),
      "Addresses Project Complexity": $("input[name=addresses]:checked").val(),
      "Completeness": $("input[name=expectation]:checked").val(),
      "Design & Analysis of Tests": $("input[name=design]:checked").val(),
      "Quality of Response During Q&A": $("input[name=quality]:checked").val(),
      "Organization": $("input[name=organization]:checked").val(),
      "Time Allotment": $("input[name=time]:checked").val(),
      "Visual Aids": $("input[name=visual]:checked").val(),
      "Confidence and Poise": $("input[name=confidence]:checked").val(),

      "Considerations Addressed": $("#considerations").val(),
      "Comments": $("#textarea1").val()
    }

    var eval = {
      "judgename": name,
      "score": scores
    };

    console.log(eval);


    var session =  $("#selectDepartment").val() +" "+ $("#selectSession").val();
	var time =  $("#selectTime").val();

    var ref = firebase.database().ref("roster");
    ref.once("value").then(function(snapshot) {
      //here snapshot.val() is array of teams
      console.log(snapshot.val());
      //found will be true if project title is in firebase
      var found = snapshot.forEach(function(childSnapshot) {
          //put each team object into childData
          var childData = childSnapshot.val();
          console.log(childData);
          if(session == childData.Session && time==childData.Time.split('-')[0]){
            console.log("Match Found at Key: " + childSnapshot.key);

            var newref = firebase.database().ref("roster/" + childSnapshot.key + "/judgescores");
            newref.once("value").then(function(snapshot) {
              snapshot.forEach(function(snap){
                var childData = snap.val();
                console.log(childData.judgename);
                console.log(childData);
                if(name == childData.judgename){
                  newref.child(snap.key).remove();
                  console.log(snap.key);

                }

              });
              var reference = firebase.database().ref("roster/"+childSnapshot.key+"/judgescores/");
              console.log(reference);
              reference.push(eval);
              //returning true will stop looping through teams
              alert("Success");
              location.reload();
              return true;
            });

            /*var reference = firebase.database().ref("roster/"+childSnapshot.key+"/judgescores/");
            console.log(reference);
            reference.push(eval);
            //returning true will stop looping through teams
            alert("Success");
            return true;*/
          }
      });

    });

});
