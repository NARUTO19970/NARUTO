const mongoose=require("mongoose");

const messageSchema=
new mongoose.Schema({

message:String,
image:String,
audio:String,
time:String

});

module.exports=
mongoose.model(
"Message",
messageSchema
);