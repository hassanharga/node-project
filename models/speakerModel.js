let mongoose = require("mongoose");
let mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;


//schema
let speakerSchema = new mongoose.Schema({
    _id:Number,
    Name:{
        type:String,
        required:true
    },
    password:String,
    mail:String,
    date:String,
    job:String,
    gender:String,
    address:{
        city:String,
        street:String,
        building:String
    },
    image:String
});


//mapping
speakerSchema.plugin(mongooseFieldEncryption, { fields: ["password"], secret: "some secret key" });
mongoose.model("speakers",speakerSchema);