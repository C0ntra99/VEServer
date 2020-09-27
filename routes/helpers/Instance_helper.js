const { v4: uuid } = require('uuid');
const logger = require('../../plugins/logger');
const Instance_schema = require('../models/Instance')
const Utilites = require('../../plugins/Utilities')
const _ = require('lodash')

const Utils = new Utilites
class Instance_helper {
    getInstance(query) {
        return new Promise((resolve, reject) => {
            let invalid_list = Utils.validate_get_query(query, ['scoring_config', 'uid', 'teams'])
            if(invalid_list) {
                return resolve({status:403, message:`Unable to perform query with the following keys`, invalid_keys:invalid_list})
            }

            //The populate function will only resolve the object IDs if verbose=true
            //Pretty proud of that functions ngl
            Instance_schema.find(_.omit(query, 'verbose')).populate(((query.verbose) ? 'instances':'')).exec( (err, round) => {
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
            })        })
    }

    create_new_instance(req) {
        return new Promise((resolve, reject) => {
            let new_instance = new Instance_schema(req.body)
            new_instance.uid = uuid();

            new_instance.save((err, instance) => {
                if(err) {
                    logger.error({label:`Instance_helper[create_new_isntance]`, message:err})
                    return resolve({status:500, message:err})
                }
                resolve({status:200, message:`Created Instance: ${instance._id}`})
                logger.info({label:`Instance_helper[create_new_isntance]`, message:`New instance created: ${instance.uid}`})
            })
        })
    }
}

module.exports = Instance_helper;