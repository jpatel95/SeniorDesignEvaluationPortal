function login(){
  $( "#loadingDiv" ).append('<div id="loader" class="preloader-wrapper active">' +
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

  var pass = (document.getElementById("password").value).replace(/<\/?[^>]+(>|$)/g, "");
  var ref = firebase.database().ref("judges");
  ref.once("value").then(function(snapshot) {
    console.log(snapshot.val());
    isMatch = snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        console.log(key, childData);
        if(pass == childData.code){
          console.log("Match Found: " + pass);
          localStorage.setItem("code", childData.code);
          localStorage.setItem("name", childData.name);
          return true;
        }
    });
    if(isMatch==true){
      console.log("Matched");
      window.location.replace("html/judgeEvaluation.html");
    } else {
      alert("Invalid code");
      console.log("did not match");
      $("#loader" ).remove();
    }
  });
}