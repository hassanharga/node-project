let express = require("express"),
    path = require("path"),
    fs = require("fs"),
    multer = require("multer"),
    mongoose = require("mongoose");
    require("../models/speakerModel");
    let speakerSchema = mongoose.model("speakers");
multerMW = multer({
    dest:path.join(__dirname,"..","publics","images")
})
    counter=1;

    authRouters = express.Router();

    //login
    authRouters.get("/login/:id?",(request,response)=>{
        response.locals.msg = request.flash("msg");
        response.render("auth/login");
    });

    authRouters.post("/login",(request,response)=>{
        speakerSchema.findOne({Name:request.body.userName},(error,result)=>{
            
            if(request.body.userName=="hassan" && request.body.userPassword=="123"){
                //cookie
                //response.cookie("lastAccess",new Date());
                response.cookie("counter",counter++);
                
                //session
                request.session.userName = request.body.userName;
                request.session.userPassword = request.body.userPassword;
                response.redirect("/admin/profile/:id?");
            }
            else if (result!= null &&request.body.userName==result.Name && request.body.userPassword==result.password){
               
                //console.log(request.body);
                //session
                request.session.userName = request.body.userName;
                request.session.userPassword = request.body.userPassword;
                response.redirect("/speakers/profile/:id?");
            }
            
            else{
    
                request.flash("msg","username or password is incorrect");
                response.redirect("/login");
            }
        })
        
    });

    //register
    authRouters.get("/register",(request,response)=>{
        response.render("auth/register");
        
    });


    authRouters.post("/register",multerMW.single("speakerImage"),(request,response)=>{
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
                // response.redirect("/speakers/list");
                response.redirect("/speakers/profile/:id?");

            }
            else{
                console.log(error);
            }
        })

      
       
    })
   

      
        
    
    authRouters.get("/logout",(request,response)=>{
        request.session.destroy((error)=>{
            response.redirect("/login");
        });
    });
    module.exports=authRouters;