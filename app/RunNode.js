console.log('Starting....'); 
var express = require('express');
var DEFERRED = require('deferred')
var path = require('path');
var fs = require('fs');
var ResOutput = {}

console.log('Starting mongodb.... npm install mongodb'); 

const {MongoClient} = require('mongodb');
const punycode = require('punycode/');
var  MongoServerError  = require('mongodb');

var bodyParser = require('body-parser');
var app = express();

const uri = "mongodb://admin:password@localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2"

    async function updateRecord( newvalues, myquery, DBName){

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            // Connect to the MongoDB cluster
            await client.connect();
    
            // Make the appropriate DB calls
            //var mClient = await  listDatabases(client);
            
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

    async function getRecord( DBName){
        var deferred1 = new DEFERRED();

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        //try {
            var a = await client.connect();

            const db = client.db(DBName)

            //console.log(myquery)
            var Results = await db.collection("users").findOne();

            ResOutput = Results

            await client.close();
            deferred1.resolve(Results);            
            return deferred1.promise
        //} catch (e) {
         //   console.error(e);
        //} finally {
        //    await client.close();
        //}
    };

    
    //app.listen(3000, function () {
    //    console.log("app listening on port 3000!");
    //});
{
   // var Output = getRecord('my-db');

    
    getRecord('my-db').then(function(collection) {
        // This function will be called afte getRecord() will be executed. 
        console.log('Results.........................................N');
        console.log(ResOutput);

     }).catch((value) => {
        console.log(value);
     });
     
     //.fail(function(err){
         // If Error accrued. 
     //    
     //});
    

//    getdb().then(function(collection) {
        // This function will be called afte getdb() will be executed. 
     
//     }).fail(function(err){
         // If Error accrued. 
     
//     });

}
//console.log('Welcome to My Console,');
//setTimeout(function() {
//    console.log('Blah blah blah blah extra-blah');
//}, 3000);
//console.log('Wiat commad...');