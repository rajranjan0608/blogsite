var mongoose    =require("mongoose");

//TABLE SCHEMA
var commentSchema=new mongoose.Schema({
    comment:String,
    reply:String
});

//MAKING TABLE
var comments=new mongoose.model("comments",commentSchema);

//EXPORTING MODULE
module.exports=comments;