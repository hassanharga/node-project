let express = require("express"),
    adminRouter = express.Router();
    
    adminRouter.get("/profile/:id?",(request,response)=>{
        //request.cookies.lastaccess;
     
        //response.locals.lastAccess=request.cookies.lastAccess;
        response.locals.counter=request.cookies.counter;

       // console.log(request.cookies.counter++);        
        response.render("admin/profile",{layout:"layout-admin"});

    });
    
module.exports=adminRouter;