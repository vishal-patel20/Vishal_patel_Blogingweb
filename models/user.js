const { Schema, model} = require("mongoose")
const {createHmac, randomBytes}= require("crypto")
const {createTokenforUser}=require("../services/authentication")
const userschema = new Schema({
    fullname: {
        type: "String",
        require: true
    },
    email: {
        type: "String",
        require: true,
        unique: true
    },

    salt: {
        type: "String",
    
    },
    password: {
        type: "String",
        require: true
    },
    profileImage:{
     type:"String",
     default :"/image/image(2).png"
    //  D:\node\vishalBlog\public\image\images (2).png
    },
    role: {
        type:"String",
        enum:["ADMIN","USER"],
        default:"USER",
        require:true
    }
}, { timestamps: true })

userschema.pre("save", async function(){   
    const user= this
    if(!user.isModified("password")) return ;
    const salt = randomBytes(16).toString();
    const hashpassword= createHmac("sha256",salt).update(user.password).digest("hex")
   this.salt= salt
   this.password=hashpassword
});

userschema.static("matchpasswordandtokengen",async function(email,password){
    const user= await this.findOne({email})
    if(!user) throw new Error ("user not found") 
     const salt = user.salt;
     const hashedpassword = user.password

    const userproviedhash= createHmac("sha256",salt).update(password).digest("hex")

if(hashedpassword!==userproviedhash)   throw new Error ("incorrect password")
 const token = createTokenforUser(user)
 return token
})
const user=model("user",userschema)
module.exports= user