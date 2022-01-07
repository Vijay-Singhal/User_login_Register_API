const { hasSubscribers } = require('diagnostics_channel');
const express = require('express');
const path=require('path');
const app=express();

const bcrypt=require('bcryptjs');

require("./db/conn");
const Register=require("../src/models/register")
const hbs=require("hbs");

const port= process.env.PORT|| 2000;
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partial_path=path.join(__dirname,"../templates/partials");


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path)
hbs.registerPartials(partial_path);


app.get('/',(req,res)=>{
    res.render("index");
});
app.get('/register',(req,res)=>{
    res.render("register");
});
app.post('/register', async (req,res)=>{
    try {
        const cpassword=req.body.cpassword;
        const passwor=req.body.password;
        if(passwor===cpassword){
            //const hashpassword= await bcrypt.hash(password);
            const registeremp=new Register({
                name : req.body.uname,
                email: req.body.email,
                password: await bcrypt.hashSync(passwor,10)
            })
            const registered= await registeremp.save();
            res.status(201).render("afterregister") 
        }
        else{
            res.send("invalid  details")
        }
    } catch (error) {
        res.status(400).send("email already registered");
    }
});

app.get('/login',(req,res)=>{
    res.render("login");
});
app.post('/login', async (req,res)=>{
    try {
        const emai=req.body.email;
        const password=req.body.password;
        //const hashpasswor= await bcrypt.hash(passwor,10);
        const usere=await Register.findOne({email:emai});

        const isMatch = bcrypt.compareSync(password,usere.password);
         if(isMatch){
             res.status(201).render("afterlogin")
         }else{
             res.send("invalid login details2");
         }
    } catch (error) {
        res.status(400).send("invalid login details");
    }
});


app.listen(port,()=>{
    console.log('server is running ${port} ');
})