// LOGIN PAGE
app.get("/",(req,res)=>{

res.render("login");

});

// LOGIN URL
app.get("/login",(req,res)=>{

res.render("login");

});

// LOGIN CHECK
app.post("/login",(req,res)=>{

const { username,password } = req.body;

// ADMIN LOGIN
if(
username==="admin" &&
password==="12345"
){

return res.render("admin");

}

// USER LOGIN
if(
username==="user" &&
password==="123"
){

return res.render("user");

}

res.send(
"Wrong Username or Password"
);

});