var express = require("express");
var app =express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    date:{type:Date,default:Date.now}
});

var Blog= mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test blog",
//     image:"https://cdn.pixabay.com/photo/2018/02/07/14/27/pension-3137209__340.jpg",
//     body: "I found this pic on Pixabay"
// });

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
            console.log(err);
        else
        {
            res.redirect("/blogs");
        }
    });
});


app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            res.redirect("/blogs")
        else{
            res.render("show",{blog:foundBlog});
        }
        
    });
});

app.get("/blogs/:id/edit",function(req, res) {
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err)
         res.redirect("/blogs");
        
        else{
            res.render("edit",{blog:foundBlog});
        }
   });
});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/"+req.params.id);
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started!!")
});