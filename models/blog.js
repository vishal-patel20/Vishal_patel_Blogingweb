const { Schema, model} = require("mongoose")
const { schema } = require("./user")
const Blogschema = new Schema({
    Tittle:{
        type:String,
        require:true
    },  body:{
        type:String,
        require:true
    },  Coverimageurl:{
        type:String,
        
    },   Createdby:{
        type:Schema.Types.ObjectId,
        ref :"user"
    },

},{timestamps:true})

const userBlog=model("Blog",Blogschema)
module.exports= userBlog
