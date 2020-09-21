const { v4: uuid } = require('uuid');
const Round_schema = require('../models/Round')
class Round_helper {

    getRound() {
        return new Promise((resolve, reject) => {

            return resolve({status:200, message:"Hello World!"})
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