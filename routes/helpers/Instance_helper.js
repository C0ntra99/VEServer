const { v4: uuid } = require('uuid');
const logger = require('../../plugins/logger');
const Instance_schema = require('../models/Instance')
class Instance_helper {
    getInstance(req) {
        return new Promise((resolve, reject) => {
            return resolve({status:200, message:'Hello World'})
        })
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