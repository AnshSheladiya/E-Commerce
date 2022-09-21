const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
    name:String,
    image:String,
    brand:String,
    price:String,
    userid:String
})

module.exports=mongoose.model('products',ProductSchema)