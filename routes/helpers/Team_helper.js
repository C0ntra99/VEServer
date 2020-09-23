const { v4: uuid } = require('uuid');
const logger = require('../../plugins/logger');
const Team_schema = require('../models/Team')
class Team_helper {

    getTeam(req) {
        return new Promise((resolve, reject) => {
            return resolve({status:200, message:'Here is a team'})
        })
    }

    create_team(req){
       return new Promise((resolve, reject) => {
           let new_team = new Team_schema(req.body);
           new_team.uid = uuid();

           new_team.save((err, team) => {
               if(err){
                   return resolve({status:500, message:err})
               }
               return resolve({status:200, team:team._id})
           })
       })
    }
    
}

module.exports = Team_helper;