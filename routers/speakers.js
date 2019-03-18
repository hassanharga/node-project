let express = require("express"),
    speakerRouter = express.Router(),
    path = require("path"),
    fs = require("fs"),
    multer = require("multer");
    mongoose = require("mongoose");
    require("../models/speakerModel");
    require("../models/eventModel");

    let speakerSchema = mongoose.model("speakers");
    let eventSchema = mongoose.model("events");
multerMW = multer({
    dest:path.join(__dirname,"..","publics","images")
})


speakerRouter.get("/profile/:id?",(request,response)=>{
    //console.log(request.session.userName);
    
     speakerSchema.findOne({Name:request.session.userName},(error,result)=>{
         eventSchema.find({mainSpeaker:result._id},((error,result2)=>{
            //console.log(result2);
            response.render("speakers/profile",{speaker:result,events:result2});
         }))
        // console.log(result);
        // response.render("speakers/profile",{speaker:result});

     })
});

//ajax call 
speakerRouter.get("/getData/:id?",(request,response)=>{
    speakerSchema.findOne({_id:request.params.id},(error,result)=>{
        //console.log("your data"+result);
        response.send(result);
    });
});

//all speakers
speakerRouter.get("/list/:id?",(request,response)=>{
    speakerSchema.find({},(error,result)=>{
        if(!error)
        response.render("speakers/list",{speakers:result});

    })
});

//add speakers
speakerRouter.get("/add/:id?",(request,response)=>{
        
    response.render("speakers/add");
});
speakerRouter.post("/add/",multerMW.single("speakerImage"),(request,response)=>{
    fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
        let speaker = new speakerSchema({
            _id:request.body.id,
            Name:request.body.name,
            password:request.body.password,
            mail:request.body.mail,
            date:request.body.date,
            job:request.body.job,
            gender:request.body.gender,
            address:{
                city:request.body.city,
                street:request.body.street,
                building:request.body.building
            },
            image:request.file.originalname
        });
        speaker.save((error)=>{
            if(!error){
                response.redirect("/speakers/list");
            }
            else{
                console.log(error);
            }
        })
});

speakerRouter.get("/edit/:id",(request,response)=>{
    console.log("**********************************"+request.params.id);
        speakerSchema.findOne({_id:request.params.id},(error,res)=>{
            //console.log(res)
        response.render("speakers/edit",{speaker:res});
   });
});
speakerRouter.post("/edit/:id?",multerMW.single("speakerImage"),(request,response)=>{
    fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
speakerSchema.update({_id:request.params.id},{
   "$set":{
    Name:request.body.name,
    password:request.body.password,
    mail:request.body.mail,
    date:request.body.date,
    job:request.body.job,
    gender:request.body.gender,
    address:{
        city:request.body.city,
        street:request.body.street,
        building:request.body.building
    },
    image:request.file.originalname
   }
},(error)=>{
    if(!error){
        response.redirect("/speakers/list/");
    }
    else{
        console.log(error);
    }
})    

});
//delete speaker
speakerRouter.get("/delete/:id",(request,response)=>{
    speakerSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/speakers/list");
    })
})



module.exports=speakerRouter;