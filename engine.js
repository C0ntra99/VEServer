//Load schemas
const Round_schema = require('./routes/models/Round');
const Instance_schema = require('./routes/models/Instance');

const logger = require('./plugins/logger');
const axios = require('axios')
class Engine {
    check_round_times() {
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
                        //logger.info({label:`Engine[check_times]`, message:`Stoping round: ${updated_round.name}`})
                    })
                }
            })
        });
    }

    get_running_instances() {
        return new Promise((resolve, reject) => {
            Instance_schema.find({running:true}, (err, instances) => {
                if(err){
                    return reject(err)
                }
                return resolve(instances)
            })
        })
        
    }

    async score_running_instances() {
        let running_instances = await this.get_running_instances();
        logger.debug({label:`engine[score_running_instances]`, message: running_instances.length})
        //Verify start time and end time here
        running_instances.forEach((instance) => {
            axios.get(`http://${instance.os_details.network.ip_addr}:8081/api/scoring`) //maybe grab port from elsewhere
            .then((resp) => {
                //logger.debug({label:`engine[score_running_instances]`, message:`Score recieved from ${instance.os_details.network.ip_addr}`})
                
                Instance_schema.findOneAndUpdate({uid:instance.uid}, {$set:{'score.previous':(!instance.score) ? 0 :instance.score.current, 'score.current':resp.data.message.score}}, {upsert:true}, (err) =>{
                    if(err){
                        logger.error({label:`engine[score_running_instances]`, message:`Error updating score: ${err}`})
                    }
                    logger.debug({label:`engine[score_running_instances]`, message: `Score updated for: ${instance.uid}`})
                    
                })
            })

            //this didnt trigger whenever there was a bad IP address
            .catch((resp,err) => {
                //logger.error({label:`engine[score_running_instances]`, message:`Unable to score Instance ${instance._id}: ${err}`})                logger.error({label:`engine[score_running_instances]`, message:`Unable to score Instance ${instance._id}: ${err}`})

                logger.error({label:`engine[score_running_instances]`, message:resp,err})

            })
            //logger.debug({label:`engine[score_running_instances]`, message:`Scoring instance: ${instance._id}`})
        })
    }
}

module.exports = Engine;