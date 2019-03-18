let mongoose=require("mongoose");

let eventSchema=new mongoose.Schema({
    _id:Number,
    title:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:new Date()
    },
    mainSpeaker:{
        type:Number,
        default:"0",
        ref:"speakers"
    },
    accepted:{
        type:String,
        default:"accepted"
    },
    others:[{
        type:Number,
        ref:"speakers"
    }]
});




mongoose.model("events",eventSchema);