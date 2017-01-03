var express=require('express');
var bodyparser=require('body-parser');
var cookieparser=require('cookie-parser');
var path=require('path');
var http=require('http');
var deployd=require('deployd');
var colors = require('colors/safe');
var nunjucks = require('nunjucks') ;

module.exports=function(options){


    var port = process.env.PORT || options.PORT || 8989;
    var env = process.env.NODE_ENV || options.ENV || 'development';
   
  
    var staticdir = 'public';
    
    var dboptions = {};
    dboptions.host = options.MONGO_HOST|| 'localhost';
    dboptions.port = options.MONGO_PORT || '27017';
    dboptions.name = options.MONGO_DB || 'depdb';
    if(env === 'production'){
        dboptions.credentials = options.MONGO_CREDENTIALS;   
    }
    
    var templateengine = options.TEMPLATE_ENGINE || '';
    var templatedir = options.TEMPLATE_DIR || 'templates';



    var app=express();
    
    
    app.use(bodyparser.urlencoded({extended:false}));

    app.use(cookieparser());


   if(templateengine!=''){
       switch(templateengine){
           case 'nunjucks':
            nunjucks.configure( templatedir, {
                autoescape: true,
                cache: false,
                express: app
            } ) ;
           app.set('view engine', 'html');
           break;
           default:
            app.set('view engine',templateengine);
            app.set("views", templatedir);           
       }

   }

  
    

    var server=http.createServer(app);

    deployd.attach(server,{
        env: env,
        db:dboptions
    });

   

    app.run=function(){
    
        var deploydRouter=server.handleRequest;
        app.use(deploydRouter);

       server.listen(port,function(){


           var getDateTime=function(){

                var date = new Date();

                var hour = date.getHours();
                hour = (hour < 10 ? "0" : "") + hour;

                var min  = date.getMinutes();
                min = (min < 10 ? "0" : "") + min;

                var sec  = date.getSeconds();
                sec = (sec < 10 ? "0" : "") + sec;

                var year = date.getFullYear();

                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" : "") + month;

                var day  = date.getDate();
                day = (day < 10 ? "0" : "") + day;

                return year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;

            };

            
            console.log(colors.green("Web server started at: %s on port: %s mode: %s"),colors.yellow.bold(getDateTime()),colors.yellow.bold(port),colors.yellow.bold(env));
            console.log(colors.green("Mongo connection string: %s"),colors.yellow.bold(server.db.connectionString));
            console.log(colors.green("Default deployd static files location: %s"),colors.yellow.bold(staticdir));
           
            if(templateengine!=''){
                console.log(colors.green("Templates in %s using  %s engine"),colors.yellow.bold(templatedir),colors.yellow.bold(templateengine));
            }
        });
    }

    return app;

}
