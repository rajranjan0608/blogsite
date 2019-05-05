var mongoose    =require("express");

//TABLE SCHEMA
var userSchema=new mongoose.Schema({

    username:String,
    email:String

});

//MAKING TABLE
var users=new mongoose.model("users", userSchema);

//EXPORTING MODULE
module.exports=users;