# deployd-shortcut
an easy way to create a deployd project and set it up as an express middleware with built in template support and configuration defaults

# how to install
```
npm install --save deployd-shortcut
```
# usage
``` javascript
var app=require('deployd-shortcut')({
    PORT:8990,
    ENV:'development',
    MONGO_HOST:'localhost',
    MONGO_PORT:27017,
    MONGO_DB:'mydb',
    TEMPLATE_ENGINE:'nunjucks',
    TEMPLATE_DIR:'mytemplates'
});


app.get('/',function(req,res){
    res.render('index',{firstname:'john',lastname:'doe'});
});

app.run();
```
# default configuration

you do not have to fill in all the configuration params since there are some default values for most of them.

the default values are:

- PORT:8989
- ENV:'development' ( the valid values are: 'development' or 'production')
- MONGO_HOST: 'localhost'
- MONGO_PORT: 27017
- MONGO_DB: 'depdb'  
- TEMPLATE_DIR: 'templates'
- TEMPLATE_ENGINE:  '' ( no template engine is set by default. the valid values are the names of the template engines that the expressjs library allready has builtin support for like: 'pug', 'ejs'.Beside those the package has also support for 'nunjucks' template engine which is actually the recommanded one(beware that the 'nunjucks' templates require a .html file extension)



