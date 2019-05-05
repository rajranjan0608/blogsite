//MODULES REQUIRED
var express         =require("express");
var bodyParser      =require("body-parser");
var mongoose        =require("mongoose");
var methodOverride  =require("method-override");
var comments        =require("./models/comments");
var blogs           =require("./models/blogs");

var app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//CONNECTING WITH DATABASE
mongoose.connect("mongodb://localhost/blogsite",{useNewUrlParser:true});

//ROUTES

// HOME PAGE : GET
app.get("/",function(req,res){
    res.redirect("/index");
});

//INDEX PAGE : GET
app.get("/index",function(req,res){
    blogs.find({},function(err,blog){
        if(err){
            console.log("There was an error");
        }
        else{
            res.render("index.ejs",{blogs:blog});
            console.log("GET    : INDEX PAGE");
        }
    });
});

//UPLOAD PAGE : GET
app.get("/upload",function(req,res){
    res.render("upload.ejs");
    console.log("GET    : UPLOAD PAGE");
});

//UPLOAD PAGE : POST
app.post("/upload",function(req,res){

    blogs.create(req.body.blog);
        
    console.log("POST   : POSTED");

    res.redirect("/index");
})

//SHOW PAGE : GET
app.get("/index/:id",function(req,res){
    
    var id=req.params.id;

     blogs.findById(id).populate("comments").exec(function(err,blog){
         if(err){
            console.log("ERROR!");
        }
        else{
                res.render("show.ejs",{blog:blog});
        }
    });

    // blogs.findById(id,function(err,blog){
    //     console.log("GET    : SHOW PAGE, ITEM : "+blog.title);
    // });    
    
});

//EDIT PAGE : GET
app.get("/index/:id/edit",function(req,res){

    var id=req.params.id;

    blogs.findById(id,function(err,blog){

        if(err){
            console.log("ERROR");
        }
        else{
            res.render("edit.ejs",{blog:blog});
            console.log("GET    : EDIT PAGE")
        }

    });

});

//UPDATE BLOG : PUT
app.put("/index/:id",function(req,res){

    var id=req.params.id;

    var newData=req.body.blog;

    blogs.findByIdAndUpdate(id, newData, function(err,newBlog){

        if(err){
            console.log("ERROR");
        }
        else{
            console.log("POST   : EDIT PAGE (UPDATED) , ITEM : "+newBlog.title);
            res.redirect("/index/"+id);
        }

    });

});

//DELETE A BLOG : DELETE
app.delete("/index/:id",function(req,res){

    var id=req.params.id;

    blogs.findByIdAndDelete(id,function(err,blog){

        if(err){
            console.log(err);
        }
        else{
            console.log("DELETE     : DELETED , ITEM : "+blog.title);
            res.redirect("/index");
        }

    });

});

//COMMENT : POST
app.post("/index/:id",function(req,res){

    //BLOG ID
    var id=req.params.id;

    //COMMENTS ARRAY FROM SHOW.EJS FILE
    var comment=req.body.comments;

    blogs.findById(id,function(err,blog){

        comments.create(comment).then(comment=>{
             
            blog.comments.push(comment);
                
            blog.save().then(blog=>{
                
                console.log("NEW COMMENT : "+comment.comment);
                res.redirect('/index/' + id);
            
            });                        
        });
    });
});

//REMOVE A COMMENT
app.delete("/index/:id1/:id2",function(req,res){

    var comment_id=req.params.id2;
    var blog_id=req.params.id1;
    console.log(comment_id+" "+blog_id);

    comments.findByIdAndDelete(comment_id,function(err){

        if(err){
            console.log("ERROR");
        }
        else{
           res.redirect("/index/"+blog_id);
        }

    });
});

//LISTENING
app.listen(3000,function(){

    console.log("Connecting...\n"+"Server running at port 3000");
});
