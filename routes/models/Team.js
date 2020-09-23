const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Team_schema = new Schema(
    {
        //This should have some more stuff for the people who pay for the service
        team_name: {type:String, required:[true, "Team name required to create a team"]},
        team_number: {type:String},
        uid: String
        /*
        instances: [
            {type: mongoose.Schema.Types.ObjectId, ref:'Instances'}
        ],
        */ 
    },
    {timestamps: true}
)

Team_schema.pre('save', function(next) {
    Team_model.findOne({$or:[{team_name:this.team_name}, {team_number:this.team_number}]}, (err, team) => {
        if(!team){
            next()
        } else {
            next("Team already exists")
        }
    })
})

module.exports = Team_model = mongoose.model("Teams", Team_schema)