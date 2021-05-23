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

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://mongo-dojo:prueba123@cluster0.rkoh4.mongodb.net/sample_training?retryWrites=true&w=majority";
const DATABASE_NAME="sample_training";
var collection_name = "companies";
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

// set health check
probe(app);

// TODO: Periodic check for config map update

// TODO: Retrieve ConfigMap

module.exports = app;
