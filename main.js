//Load conbfig
const Config = require('./config/config');
const logger = require('./plugins/logger')

//Mongo
const mongoose = require('mongoose');

//Express
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

//Engine logic
const cron = require('node-cron')
const eng = require('./engine')
const Engine = new eng

this.db_base=Config.globals.mongodb;
this.mongo_url=`${this.db_base}?retryWrites=true`

mongoose.connect(
    this.mongo_url,
    { useNewUrlParser: true, useUnifiedTopology: true}
);
mongoose.set('useFindAndModify', false);
this.db = mongoose.connection;
this.db.once("open", () => {
    logger.info({label: `dbConnection`, message:"connected to the database"});
});

this.db.on("error", (err) => {
    logger.error({label:`dbConnection`, message: `MongoDB connection error: ${err}`});
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Will loop through all the endpoints and create their respective routes
Config.endpoints.map( (local_app) => {
    app.use(local_app.route, require(local_app.app_path));
});

//Start the rest API
app.listen(port, () => {
    logger.info({label:`main`, message:`Starting server on port ${port}`});
});

//Schedule the engine
//This should be able to be configured
cron.schedule('*/3 * * * * *', () => {
    //logger.info({label:`main`, message:`Checking times`})
    Engine.check_times();
})

//^ Scorig the instances might be able to do something similar