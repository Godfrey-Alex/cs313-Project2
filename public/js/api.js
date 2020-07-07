function myFunction(){
    console.log("calling to get user info");
    let request = new XMLHttpRequest();
    request.open("GET", "/getProfile?userid=1");
    request.send();
    request.onload = () => {
        console.log(request);
        if(request.status ==200){
            console.log(JSON.parse(request.response));
            var data = JSON.parse(request.response);
            console.log("Display Name: " +data[0]["display_name"]);
            document.getElementById("userWelcome").innerHTML=data[0]["display_name"];
            //var node = document.createElement("LI");
            //var textnode = document.createTextNode(data["Title"]);
            //node.appendChild(textnode);
            //document.getElementById("movieList").appendChild(node);

        } else {
            console.log("error in request");
        }
    }

}

function listFunction(){
    console.log("calling to get lists");
    let request = new XMLHttpRequest();
    request.open("GET", "/getWishLists?userid=1");
    request.send();
    request.onload = () => {
        console.log(request);
        if(request.status ==200){
            console.log(JSON.parse(request.response));
            var data = JSON.parse(request.response);
            console.log("Wish List: " +data[0]["name"]);
            document.getElementById("wishListHeader").innerHTML=data[0]["name"];
            //var node = document.createElement("LI");
            //var textnode = document.createTextNode(data[0]["name"]);
            //node.appendChild(textnode);
            //document.getElementById("wishLists").appendChild(node);

        } else {
            console.log("error in request");
        }
    }
}

function getListItemIDs(){
    var items = [1,3];

    for (i = 0; i < items.length; i++){
    let request = new XMLHttpRequest();
    request.open("GET", "/getWishLists?userid="+items[i]);
    request.send();
    request.onload = () => {
        console.log(request);
        if(request.status ==200){
            console.log(JSON.parse(request.response));
            var data = JSON.parse(request.response);
            console.log("Wish List: " +data[0]["name"]);
            var node = document.createElement("LI");
            var textnode = document.createTextNode(data[0]["name"]);
            node.appendChild(textnode);
            document.getElementById("wishLists").appendChild(node);

        } else {
            console.log("error in request");
        }
    }
    }
}

function getItemDetails(){
    console.log("Function called to get item deets...")
    var items = [1,3];

    for (i = 0; i < items.length; i++){
    let request = new XMLHttpRequest();
    request.open("GET", "/getItemInfo?itemid="+items[i]);
    request.send();
    request.onload = () => {
        console.log(request);
        if(request.status ==200){
            console.log(JSON.parse(request.response));
            var data = JSON.parse(request.response);
            console.log("item: " + data[0]["name"]+": " +data[0]["name"]);
            var node = document.createElement("LI");
            var textnode = document.createTextNode(data[0]["name"] +", $" + data[0]["price"]+", "+data[0]["description"]);
            node.appendChild(textnode);
            document.getElementById("itemList").appendChild(node);

        } else {
            console.log("error in request");
        }
    }
    }
}

function allFunctions(){
    console.log("Calling two fucntions");
    myFunction();
    listFunction();
    getItemDetails();
}