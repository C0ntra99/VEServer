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
        state: {type: String, required:[true, "Team's residing state required"]}.
        coach: String, 
        team_email:{type:string, required:[true, "Email required for team."]} //this needs to be validated
        division: {type:String, enum:['Open','Middle School', 'rotc', etc..], required:[true, "Team division required"]}
        orginization: {type:String, descritpion:"Name of school/orgnization the team competes under."
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