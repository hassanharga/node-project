let express = require("express"),
   eventRouter = express.Router(),
   mongoose = require("mongoose"),
   path = require("path");
   require("../models/eventModel");
   require("../models/speakerModel");
let eventSchema = mongoose.model("events");
let speakerSchema = mongoose.model("speakers");

    
//list events
eventRouter.get("/list/:id?",(request,response)=>{
    
    eventSchema.find({}).populate({"path":"mainSpeaker others"}).then((result)=>{
        console.log(result.others);
        response.render("events/list",{events:result});
    })
});

//add events
eventRouter.get("/add/",(request,response)=>{
        speakerSchema.find({},(error,result)=>{
            response.render("events/add",{speakers:result});
        });
    });
eventRouter.post("/add",(request,response)=>{
    console.log(request.body);
    let event = new eventSchema({
        _id:request.body.id,
        title:request.body.title,
        mainSpeaker:request.body.mainSpeaker,
        others:request.body.otherSpeakers
    });
        event.save((error)=>{
        if(!error){
        response.redirect("/events/list");
        }
        else{
            console.log(error);
        }
    });
});

//edit events
eventRouter.get("/edit/:id",(request,response)=>{
    // eventSchema.findOne({_id:request.params.id},(error,result)=>{
    //     response.render("events/edit",{event:result});
    // })
    eventSchema.findOne({_id:request.params.id}).populate({"path":"mainSpeaker others"}).then((result)=>{
        speakerSchema.find({},(error,result2)=>{
            console.log(result.others);
            console.log(result2.others);
            response.render("events/edit",{event:result,speakers:result2});

        })
            //response.render("events/edit",{event:result});

        
    })
});

eventRouter.post("/edit/:id",(request,response)=>{
    eventSchema.update({_id:request.params.id},{
        "$set":{
            title:request.body.title,
            mainSpeaker:request.body.mainSpeaker,
            others:request.body.otherSpeakers
        }
     },(error)=>{
         if(!error){
             response.redirect("/events/list");
         }
     }) 
    
});
//reject event
eventRouter.get("/reject/:id?",(request,response)=>{
    eventSchema.update({_id:request.params.id},{
                "$set":{
                    accepted:"refused"
                }
            },(error)=>{
                if(!error){
                    response.send("done");
                }
            })
});


//remove events
eventRouter.get("/delete/:id",(request,response)=>{
    eventSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/events/list");
    })
})



module.exports=eventRouter;