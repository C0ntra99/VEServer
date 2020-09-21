const Round_schema = require('./routes/models/Round');
const logger = require('./plugins/logger');
class Engine {
    check_times() {
        //logger.info({label:`Engine[check_times]`, message:`Checking times on running rounds`})
            //This will have to be changed once I implement pausing the round
        Round_schema.find({running:true}, (err, running_rounds) => {
            //logger.debug({label:`Engine[check_times]`, message:`Running Rounds: ${running_rounds.length}`})

            running_rounds.forEach((round) => {
            
                //logger.debug({label:`Engine[check_times]`, message:`Round: ${round.name}`})
                //logger.debug({label:`Engine[check_times]`, message:`Round Time: ${round.time_started}`})

                let current_date = new Date()
                let mins_since_started = ((current_date - round.time_started)/1000)/60
                //logger.debug({label:`Engine[check_times]`, message:`Time since Started: ${mins_since_started > }`})

                if(mins_since_started >= round.config.round_time_limit) {
                    logger.info({label:`Engine[check_times]`, message:`Round: ${round.name} has exceeded the time limit`})
                    Round_schema.findOneAndUpdate({name:round.name}, {running:false, completed:true}, {new:true}, (err, updated_round) => {
                        logger.info({label:`Engine[check_times]`, message:`Stoping round: ${updated_round.name}`})
                    })
                }
            })
        });
    }
}

module.exports = Engine;