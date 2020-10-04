const mongoose = require('mongoose');
const logger = require('../../plugins/logger');
const Schema = mongoose.Schema;
const Round_model = require('./Round')
const Team_model = require('./Team')

const Instance_schema = new Schema(
    {
        os_details:{
            hostname:{type:String, required:[true, 'Hostname required']},
            release: {type:String, required:[true, 'Os release required']},
            network:{
                ip_addr: {type:String, required:[true, 'Ip address required for communication']},
                hw_addr: {type:String, required:[true, 'Hardware (mac) address required for super secret spy stuff ;)']}
            }
        },
        scoring_config: Object, //This might be able to have its own DB at somepoint. Or atleast a "market place" for scoring engine configs
        team: {type: String, ref: 'Teams', default:null},
        score: {
            current: Number,
            previous: Number
        },
        uid: String,
        running: {type:Boolean, default:false},
        round: {type: String, required:[true, 'Round required'], ref: 'Rounds', default:null}
    },
    {timestamps: true}
)

//Verify that the team and round exists
Instance_schema.pre('save', async function(next){
    //These if statements are disgusting but its better than the last iteration
    /*
    let existing_team = await Team_model.findOne({team_name:this.team}, (err) => {
        if(err){
            next(err)
        }
    })
*/
    let existing_round = await Round_model.findOne({name:this.round}, (err) => {
        if(err) {
            next(err)
        }
    })

    //if(!existing_team){
    //    next("Team not found")
    //} else 
    if (!existing_round) {
        next("Round not found")
    }
    if(!existing_round.running){
        next("Round not running")
    }
    next()
})

Instance_schema.post('save', function(instance) {
    /*
    if(this.team){
        Team_model.findOneAndUpdate({_id:this.team._id}, {$push:{instances:instance}}, {new:true},(err, new_team) => {
            if(err) {
                next(err)
            }
            console.log(`Updated team: ${new_team}`)
        })  
    }
    */
    //When updating a document that is referencing please for the love of god push the entire document and not just the ._id
    //While pushing the ._id will work its just kinda gross...Not that everything else in this ISNT gross but still
    if(this.round){
        Round_model.findOneAndUpdate({name:this.round}, {$push:{instances:instance._id}},{new:true}, (err, new_round) => {
            if(err) {
                next(err)
            }
            logger.info({label:`Instance_schema[post]`, message:`Updated Round: ${new_round.id}`})
        })
    }
})

module.exports = Instance_model = mongoose.model("Instances", Instance_schema);