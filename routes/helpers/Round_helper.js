const { v4: uuid } = require('uuid');
const Round_schema = require('../models/Round')
const _ = require('lodash')
const logger = require('../../plugins/logger')
const Utilities = require('../../plugins/Utilities')

const Utils = new Utilities;

class Round_helper {

    getRound(query) {
        return new Promise((resolve, reject) => {

            let invalid_list = Utils.validate_get_query(query, ['instances', 'config', 'teams'])
            if(invalid_list) {
                return resolve({status:403, message:`Unable to perform query with the following keys`, invalid_keys:invalid_list})
            }

            //The populate function will only resolve the object IDs if verbose=true
            //Pretty proud of that functions ngl
            Round_schema.find(_.omit(query, 'verbose')).populate(((query.verbose) ? 'instances':'')).exec( (err, round) => {
                logger.info({label:`getRound`, message:`Round query with the following parameters: ${JSON.stringify(query)}`})
                if(err){
                    //I really hate if statements...I dont wanna use them :'(
                    logger.err({label:`getRound`, message:err})
                    return resolve({status:500, message:err})
                } else if(!round) {
                    return resolve({status:200, message:`No round found with the given parameters`})
                } else {
                    return resolve({status:200, round:round})
                }
            })
        })
    } 

    makeRound(req) {
        return new Promise((resolve, reject) => {
            let new_round = new Round_schema(req.body);
            new_round.uid = uuid()
            new_round.save((err) => {
                if(err){
                    //reject(err)
                    return resolve({status:500, message: err})
                }

                return resolve({status:200, message: new_round})
            })
        })
    }

    startRound(params) {
        return new Promise((resolve, reject) => {
            Round_schema.findOne({name:params.name}, (err, round) => {
                if(err) {
                    return resolve({status:500, message:err})
                }
                if(!round) {
                    return resolve({status:400, message:`Round ${params.name} not found!`});
                } else if(round.running == true) {
                    return resolve({status:200, message: `Round ${round.name} is already running`})
                } else if (round.completed == true) {
                    return resolve({status:200, message:`Round ${round.name} has been completed already`})
                }
                    //This is an interesting way to do this
                round.updateOne({running:true, time_started:new Date()}, (err, new_round) => {
                    if(err) {
                        return resolve({status:500, message:err})
                    }
                })

                //Tbhis is where a loop with a callback should be started
                /*
                    while current_time - time_started < round.config.round_time_limit
                */
                return resolve({status: 200, message:`Round ${params.name} started`})
                
            })
        })
    }

    stopRound(params) {
        return new Promise((resolve, reject) => {
            Round_schema.findOneAndUpdate({name:params.name}, {running:false}, (err, round) => {
                return resolve({status: 200, message:`Round ${params.name} has been stopped`})
            })
        })
    }
}

module.exports = Round_helper;