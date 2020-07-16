var path = require('path');
var express = require("express");
var app = express();
app.use(express.json() );
app.use(express.urlencoded({ extended: true }));

const { Pool } = require("pg");
const { json } = require('express');
const connectionString = process.env.DATABASE_URL || "postgres://wishlistuser:password1@localhost:5432/wishlistdb"
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.use(express.static("public"));

app.get('/home.html', (req, res) => res.send(home.html))

app.get("/getProfile", getProfile)
app.get("/getwishLists", getwishLists)
app.get("/getwishListItems", getwishListItems)
app.get("/getItemInfo", getItemInfo)

app.get("/getuserwishListItems", getuserwishListItems)

app.post("/addItemToList", addItemToList)
app.post("/deleteItem", deleteItem)
app.get("/login", login)
app.get("/createUser", createUser);

app.listen(app.get("port"), function(){
    console.log("Connection string:" + connectionString);
    console.log("Serve now listening on port: ", app.get("port"));
});

function deleteItem(req,res){
    console.log("deleting item: " + req.body.itemid);
    DBdeleteItem(req, function(error, result){
        console.log("back from DB after Deleting item: ", result);
        res.json(result);
    });
}

function DBdeleteItem(req,callback){
    var id = req.body.itemid;
    sql = "DELETE from userwishlistTable where id = "+id;
    pool.query(sql, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}

function createUser(request, res){
    console.log("Creating user: " + request.query.username + "password: "+request.query.password + "displayName: " + request.query.displayName);
    DBcreateUser(request, function(error, result){
        console.log("back from DB after creating user: ", result);
        res.json(result);
    });

}

function DBcreateUser(req, callback){
    var username = req.query.username;
    var password = req.query.password;
    var displayName = req.query.displayName;
    var sql = "INSERT INTO userTable (username, password, display_name) VALUES ('"+username+"', '"+password+"', '"+displayName+"');";

    pool.query(sql, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });

}

function login(request, res) {
    console.log("login called " + request.query.username );
    //var result = {success: false};	
    
    DBLogin(request, function(error, result){
        console.log("Back from DB with user id: ", result);
        res.json(result);
    })  
}

function DBLogin(req,callback){
    var username = req.query.username;
    var password = req.query.password;
    var sql = "SELECT id from userTable where username = '"+username+"' and password = '" + password + "';";
    console.log("login sql statment: "+sql);
    pool.query(sql, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}


function addItemToList(req,res){
    console.log("***Adding item to list***" + req.body);
    var result = {success: false};
    console.log("received post call to add item to list. name: "+ req.body.itemName);
    DBaddItemToList(req, function(error, result){
        console.log("Back from DB after attempting to add item: ", result);
    })
    res.json(result);
}

function DBaddItemToList(req, callback){
    var ownerID = req.body.userid;
    var itemName = req.body.itemName;
    var itemPrice = req.body.itemPrice;
    var itemDesc = req.body.itemDesc;
    var itemUrl = req.body.itemURL;

    if(!itemUrl.startsWith("https://")){
        itemUrl = "https://" + itemUrl;
    }

    console.log("executing DB funtion to add an item: ownerid: " + ownerID + " itemName: "+ itemName
    + " Price: "+ itemPrice + " Description: " + itemDesc + " URL: "+ itemUrl);
    var sql = "INSERT INTO userwishlistTable (ownerId, name, price, description, url) VALUES ('"+ownerID+"', '"+itemName+"', '"+itemPrice+"', '"+itemDesc+"', '"+itemUrl+"');"
    console.log("SQL: " + sql);
    pool.query(sql, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Added item to DB");
        result = {success: true}
        callback(null,result)
    });
}
 

function getuserwishListItems(req, res){
    console.log("received input: ", req.query.userid)
    var userID = req.query.userid;
    DBgetUserWishListItems(userID, function(error, result){
        console.log("Back from DB with results: ", result);
        res.json(result);
    });
}

function DBgetUserWishListItems(id, callback){
    console.log("Function called to query DB for user wishlist Items: ", id);
    var sql = "SELECT * from userwishlisttable WHERE ownerId = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}

function getProfile(req, res){
    console.log("received input: ", req.query.userid)
    var userID = req.query.userid;
    console.log("Getting user profile with id: ", userID);
    DBgetProfile(userID, function(error, result){
        console.log("Back from DB with results: ", result);
        res.json(result);
    });
}

function getwishLists(req, res){
    var userID = req.query.userid;
    console.log("Getting Wish list for a user: ", userID);
    DBgetwishLists(userID, function(error, result){
        console.log("Back from DB with results: ", result);
        res.json(result);
    });
}

function getwishListItems(req, res){
    var wishlistItemsID = req.query.wishlistid;
    console.log("Getting Wish list items with id: ", wishlistItemsID);
    DBgetwishListItems(wishlistItemsID, function(error, result){
        console.log("Back from DB with results: ", result);
        res.json(result);
    });
}

function getItemInfo(req, res){
    var itemId = req.query.itemid;
    console.log("Getting item info with id: ", itemId);
    DBgetItemInfo(itemId, function(error, result){
        console.log("Back from DB with results: ", result);
        res.json(result);
    });
}

function DBgetProfile(id, callback){
    console.log("Function called to query DB for user profile with id: ", id);
    var sql = "SELECT id, username, display_name FROM userTable WHERE id = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}

function DBgetwishLists(id, callback){
    console.log("Function called to query DB for user wishlist IDs: ", id);
    var sql = "SELECT * FROM wishlistTable WHERE ownerid = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}

function DBgetwishListItems(id, callback){
    console.log("Function called to query DB for items on wishlist: ", id);
    var sql = "SELECT itemID FROM itemList WHERE wishlistID = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}

function DBgetItemInfo(id, callback){
    console.log("Function called to query DB for items on wishlist: ", id);
    var sql = "SELECT * FROM item WHERE id = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result){
        if (err){
            console.log("An error with the DB occured: ", err);
            callback(err, null);
        }
        console.log("Found DB result: "+JSON.stringify(result.rows))
        callback(null,result.rows)
    });
}