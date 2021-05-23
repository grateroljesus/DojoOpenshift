'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jsyaml = require('js-yaml');

const app = express();

// Health Check Middleware
const probe = require('kube-probe');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let configMap;
var hello= process.env.MESSAGE;
let message = hello+", %s!";

app.use('/api/greeting', (request, response) => {
  const name = (request.query && request.query.name) ? request.query.name : 'World';
  return response.send({content: message.replace(/%s/g, name)});
});


var fs = require('fs'),
configPath = '/opt/app-root/src/configs/config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
var storageConfig=  parsed;

const {MongoClient} = require('mongodb');
const uri = storageConfig.development.database.uri;
const DATABASE_NAME=storageConfig.development.database.database_name;
var collection_name = storageConfig.development.database.collection_name;
var collection="";

app.listen(5000, () => {
    MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        var database = client.db(DATABASE_NAME);
        collection = database.collection(collection_name);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.get("/api/companies", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});



var healthy = true;
app.get('/ready', function(req, res) {
      var now = Math.floor(Date.now() / 1000);
      var lapsed = now - started;
      if (lapsed > 30) {
        console.log('ping /ready => pong [ready]');
        res.send('Ready for service requests...\n');
      }
      else {
	console.log('ping /ready => pong [notready]');
	res.status(503);
        res.send('Error! Service not ready for requests...\n');
      }
});


app.get('/healthz', function(req, res) {
    if (healthy) {
      console.log('ping /healthz => pong [healthy]');
      res.send('OK\n');
    }
    else {
      console.log('ping /healthz => pong [unhealthy]');
      res.status(503);
      res.send('Error!. App not healthy!\n');
    }
});

var started = Math.floor(Date.now() / 1000);


module.exports = app;


