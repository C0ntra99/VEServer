const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Round_schema = new Schema(
    {
        name: {type:String, required:[true, 'Round name required']},
        uid: String,
        running:{type:Boolean,default:false},
        instances: [
            {type:mongoose.Schema.Types.ObjectId, ref:'Instances'}
        ],
        config: {
            //These settings should be buy locked
            //Default time for the rounds are 24 hours and each instance has 6 hours
            //Represented by minutes
            round_time_limit: {type:Number,min:1, max:9999, default:1444},
            instance_time_limit: {type:Number, min:1, max:9999, default:360},
            instance_limit: {type:Number, min:1, max:5, default:1}
        },
        teams:[
            {type:mongoose.Schema.Types.ObjectId, ref:'Teams'}
        ],
        time_started: Date,
        time_finished: Date,
        completed: false
    },
    {timestamps:true}
)


//Middleware to check for existing round
Round_schema.pre('save', function(next) {
    Round_model.findOne({name:this.name}, (err, round) => {
        if(!round) {
            next()
        } else{
            next("Round already exists")
        }
    })
})


module.exports = Round_model = mongoose.model("Rounds", Round_schema)