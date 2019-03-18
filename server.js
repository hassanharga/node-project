let express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    bodyParser = require("body-parser"),
    //express_ejs_layout = require("express-ejs-layouts"),
    express_session = require("express-session"),
    cookie_parser = require("cookie-parser"),
    connect_flash = require("connect-flash"),
    mongoose = require("mongoose"),
    authRouters = require("./routers/authorization"),
    adminRouters = require("./routers/admin"),
    speakerRouter = require("./routers/speakers"),
    eventRouter =require("./routers/events") ;
    
    require("./models/speakerModel");
    require("./models/eventModel");

    let speakerSchema = mongoose.model("speakers");
    let eventSchema = mongoose.model("events");


    mongoose.connect("mongodb://localhost:27017/itiEvents");
//open server
let server = express();


//middlewares

//first middleware using morgan
server.use(morgan("short"));


//second middleware checking minutes
// server.use((request,response,next)=>{
//     let minutes = new Date().getMinutes();
//     if(minutes<20){
//        console.log("O.K");
//        next();
//     }
//     else{
//         console.log("Error");
//         next(new Error("You Are not Authorized"));
//     }
// });


//third middleware redirection
// server.use((request,response)=>{
//     response.redirect("/");
// });


//error middleware
server.use((error,request,response,next)=>{
    response.send("Error : "+error);
});


//////////////////////////Routing//////////////////////////////
server.set("view engine","ejs");
server.set("views",path.join(__dirname,"views"));
server.use(bodyParser.urlencoded({extended:false}));
server.use(express.static(path.join(__dirname,"publics")));
// server.use(express.static(path.join(__dirname,"node_modules","jquery","dist")));
// server.use(express.static(path.join(__dirname,"node_modules","bootstrap","dist")));
// server.use(express_ejs_layout);
// server.set("view options" , {layout:"layout-admin"});
//server.use("layout",path.join("layouts","layout"))
server.use(express_session({
    secret:"hassan",
   // cookie:{maxAge:1000}
}));
server.use(cookie_parser());
server.use(connect_flash());

//routing to home page
server.use(/\//,(request,response)=>{
    eventSchema.find({}).populate({"path":"mainSpeaker others"}).then((result)=>{
        speakerSchema.find({},(error,result2)=>{
           //console.log(result[0].date);
            response.render("index",{speakers:result2,events:result});
        })
       
    })
    //response.sendFile(path.join(__dirname,"views","index.html"));
    //response.render("index");
});
server.use(authRouters);

//check session
server.use((request,response,next)=>{
    if(request.session.userName &&request.session.userPassword){
        response.locals.userName= request.session.userName ;
        next();
    }
    else{
        request.flash("msg","session Dead");
        response.redirect("/login");
    }
});
server.use("/admin",adminRouters);
server.use("/speakers",speakerRouter);
server.use("/events",eventRouter);


//in case there is not pages
server.use((request,response)=>{
    console.log(request.url);
    response.send("Page Not Found");
});


//listening
server.listen(8080,()=>{
    console.log("server is running at port 8080");
})