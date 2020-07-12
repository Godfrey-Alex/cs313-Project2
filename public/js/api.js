function myFunction(){
    //console.log("calling to get user info");
    let request = new XMLHttpRequest();
    request.open("GET", "/getProfile?userid=1");
    request.send();
    request.onload = () => {
        //console.log(request);
        if(request.status ==200){
            console.log(JSON.parse(request.response));
            var data = JSON.parse(request.response);
            document.getElementById("userWelcome").innerHTML="Welcome " + data[0]["display_name"];  
            sessionStorage.setItem("currentUserId", data[0]["id"]);
        } else {
            console.log("error in request");
        }
    }

}

function listFunction(){
    var data; 
    var lists = new Array();
    //console.log("calling to get lists");
    let request = new XMLHttpRequest();
    request.open("GET", "/getWishLists?userid=1");
    request.send();
    request.onload = () => {
        //console.log(request);
        if(request.status ==200){
            //console.log(JSON.parse(request.response));
            data = JSON.parse(request.response);
            for (var i = 0 ; i < data.length ; i++){
                //console.log("Wish List: " +data[i]["name"]);
                //document.getElementById("wishListHeader").innerHTML=data[i]["name"];
                var h = document.createElement("h3");
                h.id="wishlistid"+data[i]['id'];
                var t = document.createTextNode(data[i]["name"]);
                h.appendChild(t);
                document.body.appendChild(h);
                lists.push(data[i]['id']);
                sessionStorage.setItem("listIdArray", lists);
            }
        } else {
            console.log("error in request");
        }

    }

    //console.log("after api call: " + sessionStorage.getItem("listIdArray"));


}

function getListItemIDs(){
    var myObject; 
    var listIDS = sessionStorage.getItem("listIdArray");   
    for (i = 0 ; i < listIDS.length ; i+=2){   
        let request = new XMLHttpRequest();   
        request.open("GET", "/getwishListItems?wishlistid="+listIDS[i]);             
        request.send();       
        request.onload = () => {          
            //console.log("item ids: " + JSON.parse(request.response));
            if(request.status == 200){              
                var data = JSON.parse(request.response);
                    myObject + "l" +i;            
                    for ( var j = 0 ; j < data.length ; j++){
                        //console.log("index 8 "+i);
                        //console.log("listid: " + i +" Data: " + data[j]["itemid"]);
                        myObject + "i"+j;
                    }
                    sessionStorage.setItem("wishlist"+i,myObject);
            } else {
                console.log("error in request");
            }
        }
    }
    console.log("session data" + Object.keys(sessionStorage));
}

function getItemDetails(){
    //console.log("Function called to get item deets...")
    var items = [1,3];

    for (i = 0; i < items.length; i++){
    let request = new XMLHttpRequest();
    request.open("GET", "/getItemInfo?itemid="+items[i]);
    request.send();
    request.onload = () => {
        //console.log(request);
        if(request.status ==200){
            //console.log(JSON.parse(request.response));
            var data = JSON.parse(request.response);
            //console.log("item: " + data[0]["name"]+": " +data[0]["name"]);
            var node = document.createElement("LI");
            var textnode = document.createTextNode(data[0]["name"] +", $" + data[0]["price"]+", "+data[0]["description"]);
            node.appendChild(textnode);
            document.getElementById("wishlistid1").appendChild(node);

        } else {
            console.log("error in request");
        }
    }
    }
}

function getWishList(){
    var userID = sessionStorage.getItem("currentUserId");
    console.log("getting list from db Current user id: "+ userID);
    let request = new XMLHttpRequest();
    request.open("GET", "/getuserwishListItems?userid="+userID);
    request.send();
    request.onload = () => {        
        if(request.status == 200){
            console.log(JSON.parse(request.response));            
            var data = JSON.parse(request.response);
            console.log("data: " + data[1]["name"] + " data length: "+ data.length);

                for ( j = 0 ; j < data.length ; j++){
                    var node = document.createElement("LI");
                    node.id="item"+data[j]["id"];
                    var textnode = document.createTextNode(data[j]["name"] +", $" + data[j]["price"]+", "+data[j]["description"]);
                    node.appendChild(textnode);
                    document.getElementById("itemList").appendChild(node);

                    var link = document.createElement('a');
                    link.href = data[j]["url"];
                    link.innerHTML = "   View on site"; 
                    document.getElementById("item"+data[j]["id"]).appendChild(link);

                    //var btn = document.createElement("BUTTON");
                    //var txt = document.createTextNode("View on Site");
                    //btn.appendChild(txt);
                    //btn.addEventListener("click", function(){
                        //location.replace(data[j]["url"]);
                    //});  
                    //

                }

        } else {
            console.log("error in request");
        }
    }


}

function addItemToList(){
    console.log("You want to add an item to list?...");
    var currentUserId =  sessionStorage.getItem("currentUserId");
    console.log("current id: "+currentUserId);
    var itemName = document.getElementById("name").value;
    console.log("itemName: "+ itemName);
    var itemPrice = document.getElementById("price").value;
    console.log("itemPrice: "+ itemPrice);
    var itemDesc = document.getElementById("description").value;
    console.log("itemDesc: "+ itemDesc);
    var itemURL = document.getElementById("url").value;
    console.log("itemURL: "+ itemURL);

    var params = {
        userid: currentUserId,
        itemName: itemName,
        itemPrice: itemPrice,
        itemDesc: itemDesc,
        itemURL: itemURL
    }
    console.log(params);

    $.post("/addItemToList", params, function(result){
        if(result && result.success){
            console.log("Sucessfully Added item to list")
        } else {
            console.log("Error adding user");
        }
    });


    //document.getElementById("userWelcome").innerHTML="*%&$^%&%$^$" + currentUserId + itemName + itemPrice + itemDesc + itemURL;
    /*
    let request = new XMLHttpRequest();
    request.open("POST", "/getItemInfo?userID="+currentUserId+"?itemName="+itemName+"?price="+itemPrice+"?description="+itemDesc+"?url="+itemURL);
    request.send();
    request.onload = () => {
        //console.log(request);
        if(request.status ==200){
            //console.log(JSON.parse(request.response));
            console.log("Successfully Posted the response.");

        } else {
            console.log("error in request");
        }
    }
    */


}

function allFunctions(){
    //console.log("Calling two fucntions");
    myFunction();
    getWishList();
    //listFunction();
    //getListItemIDs();
    //getItemDetails();
}