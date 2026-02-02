const { Schema, model} = require("mongoose")


const Commentschema = new Schema({
    content:{
        type:String,
        require : true
    },
        blogId:{
        type:Schema.Types.ObjectId,
        ref : "blog"
    }
    ,
    createdby:{
        type:Schema.Types.ObjectId,
        ref :"user"
    }
},
    {timestamps: true})

const comment=model("comment",Commentschema)
    module.exports= comment