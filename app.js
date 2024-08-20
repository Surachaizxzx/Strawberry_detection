const express=require('express');
const app=express();
const callback=require('./service/callback');
const sendimg=require('./service/sendimg')
app.use(express.json());
app.post("/callback", async (req, res) => {
    return callback(req, res);
})
app.post("/sendimg",async(req,res)=>{
    return sendimg(req,res);
})




module.exports=app;
