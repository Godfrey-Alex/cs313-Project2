function createAccount(){
    console.log("Create Account Called");
    var username = $("#username").val();
    var password = $("#password").val();
    var displayName = $("#displayName").val();

    //window.alert("username: " + username + " password: " + password + " displayName: " + displayName);

    let request = new XMLHttpRequest();
    request.open("GET", "/createUser?username="+username+"&password="+password+"&displayName="+displayName);
    request.send();
    request.onload = () => {
        //console.log(request);
        if(request.status ==200){
            console.log("data from login: "+ JSON.parse(request.response));
            data = JSON.parse(request.response);
            //console.log(data[0]["id"]);
            //sessionStorage.setItem("currentUserId", data[0]["id"]);
            window.location = "/home.html";
        } else {
            console.log("error in request");
        }
    }

}