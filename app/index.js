var express = require('express');
var DEFERRED = require('deferred')
var path = require('path');
var fs = require('fs');

const {MongoClient} = require('mongodb');
const punycode = require('punycode/');
var  MongoServerError  = require('mongodb');

var bodyParser = require('body-parser');
var app = express();

// use when starting application locally
//const uri = "mongodb://admin:password@localhost:27027/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2"

// use when starting application as docker container
let uri = "mongodb://admin:password@mongodb";

    async function updateRecord( newvalues, myquery, DBName){

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            // Connect to the MongoDB cluster
            await client.connect();
            
            const db = client.db(DBName)
            var Results = await db.collection("users").updateOne(myquery, newvalues, { upsert: true });
            console.log(Results)
            await client.close()
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }

        
    };

    async function getRecord( myquery, DBName, Results){
        var deferred1 = new DEFERRED();

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            // Connect to the MongoDB cluster

            await client.connect();
            
            const db = client.db(DBName)
            
            var Results = await db.collection("users").findOne(myquery);
            await client.close();
            deferred1.resolve(Results);            
            return deferred1.promise
            
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    };

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use(bodyParser.json());
    
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, "index.html"));
    });
  
    app.get('/profile-picture', function (req, res) {
        var img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    });


    app.post('/update-profile', function (req, response) {
        var userObj = req.body;
        userObj['userid'] = 1;

        var newvalues = { $set: userObj };
        var myquery = { userid: 1 };
        var DBName = 'my-db'

        updateRecord(newvalues, myquery, DBName)
        response.send(userObj);
    });

    app.get('/get-profile', function (req, response) {
                    
        var myquery = { userid: 1 };
        var DBName = 'my-db'
        
        getRecord(myquery, DBName).then(function(ResOutput) {
            // This function will be called afte getRecord() will be executed. 
            //console.log(ResOutput);
            response.send(ResOutput ? ResOutput : {});
    
         });            
    })

    
    app.listen(3000, function () {
        console.log("app listening on port 3000!");
    });
