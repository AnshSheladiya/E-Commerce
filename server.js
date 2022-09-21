const express = require("express");
const cors = require("cors");
require("./config");
const user = require("./model/UserSchema");
const product = require("./model/ProductSchema");
const jwt = require("jsonwebtoken");
const jwtKey = "mysecretkey";
const multer=require('multer')
const app = express();
const port = 8383;

app.use(express.json());
app.use(cors());

app.post("/registeruser", async (req, res) => {
  let chk=await user.findOne({email:req.body.email})
if(chk){
  return res.status(400).send({ansh:'That user already exisits!'});
}  else{
  let newUser = new user(req.body);
  let finalData = await newUser.save();
  finalData=finalData.toObject()
  delete finalData.password;
  if(finalData){
  res.send(finalData)
  } else {
    res.send({ result: "usernotfound" });
  }
}
});

app.post("/loginuser", async (req, res) => {
  if (req.body.password && req.body.email) {
    let finalData = await user.findOne(req.body).select("-password");
    if (finalData) {
        jwt.sign({finalData},jwtKey,{expiresIn:"2h"},(err,token)=>{
          if(err){
            res.send({result:'something went wrong'})
          }
          res.send({finalData,auth:token})
        })
    } else {
      res.send({result: "usernotfound" });
    }
  }
});

app.post("/add_product", async (req, res) => {
  const newProduct = new product(req.body);
  const finalData = await newProduct.save();
  res.send(finalData);
});

app.get("/all_products", async (req, res) => {
  const finalData = await product.find();
  res.send(finalData);
});

app.delete("/deleteproduct/:id", async (req, res) => {
  const finaldata = await product.deleteOne({ _id: req.params.id });
  res.send(finaldata);
});

app.get("/getupdateproduct/:id", async (req, res) => {
  const finalData = await product.findOne({ _id: req.params.id });
  res.send(finalData);
});

app.put("/updateproduct/:id", async (req, res) => {
  const finalData = await product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(finalData);
});

app.get("/searchproduct/:key", async (req, res) => {
  const finalData = await product.find({
    $or: [{ name: { $regex: req.params.key } }],
  });
  res.send(finalData);
});



const upload=multer({
  storage:multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,"client/public/images")
    },
    filename:function(req,file,cb){
      cb(null,file.fieldname+"-"+Date.now()+".jpg")
    }
  })
}).single("user_file")

app.post("/upload",upload,(req,res)=>{
  res.send("file upload")
})

app.listen(port, () => console.log(`app listening on port ${port}!`));
