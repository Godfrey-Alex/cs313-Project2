/*
function login() {
    console.log("login called");
	var username = $("#username").val();
	var password = $("#password").val();

	var params = {
		username: username,
		password: password
	};

	$.post("/login", params, function(result) {
		if (result ) {
            console.log("result: " +result.id);
			$("#status").text("Successfully logged in.");
		} else {
			$("#status").text("Error logging in.");
		}
	});
}
*/

function login(){
    //console.log("calling to get user info");
    //sessionStorage.setItem("currentUserId", 1);

    console.log("login called");
	var username = $("#username").val();
	var password = $("#password").val();

    let request = new XMLHttpRequest();

    request.open("GET", "/login?username="+username+"&password="+password);;
    request.send();
    request.onload = () => {
        //console.log(request);
        if(request.status ==200){
            data = JSON.parse(request.response);
            console.log(data[0]["id"]);
            sessionStorage.setItem("currentUserId", data[0]["id"]);
            window.location = "/home.html";
        } else {
            console.log("error in request");
        }
    }

}