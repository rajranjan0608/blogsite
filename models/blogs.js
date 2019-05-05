var mongoose        =require("mongoose");

//TABLE SCHEMA
var blogSchema=new mongoose.Schema({
    title:String,
    url:String,
    body:String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "comments",
        }
     ]
});

//MAKING TABLE
var blogs=new mongoose.model("blogs",blogSchema);

//EXPORTING MODULE
module.exports=blogs;