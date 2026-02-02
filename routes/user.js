const{ Router }=require("express")
const route=Router()
const user = require("../models/user")


route.get("/signin",(req,res)=>{
    return res.render("signin")
})
route.get("/signup",(req,res)=>{
    return res.render("signup")
})
route.post("/signup",async(req,res)=>{
    const {fullname,email,password} = req.body
    await user.create({
        fullname,
        email,
        password
    })
    return res.redirect("/")
})
route.post("/signin",async(req,res)=>{
    const {email,password} = req.body
    try {
         const Token = await user.matchpasswordandtokengen(email,password)
//  console.log("Token",Token);
    return res.cookie("Token",Token).redirect("/")
    } catch (error) {
        return res.render("signin",{error:"incorect email and password"})   
    }

})
route.get("/logout", (req,res)=>
{
    res.clearCookie("Token").redirect("/")
})

module.exports=route 