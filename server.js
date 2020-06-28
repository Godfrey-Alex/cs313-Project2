var express = require("express");
var app = express();

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://wishlistuser:password1@localhost:5432/wishlistdb"
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.use(express.static("public"));

app.get('/home.html', (req, res) => res.send(home.html))

app.get("/getProfile", getProfile)
app.get("/getwishLists", getwishLists)
app.get("/getwishListItems", getwishListItems)
app.get("/getItemInfo", getItemInfo)

app.listen(app.get("port"), function(){
    console.log("Serve now listening on port: ", app.get("port"));
})

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
    var sql = "SELECT * FROM wishlistTable WHERE id = $1::int";
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