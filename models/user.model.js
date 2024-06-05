const bcrypt=require('bcrypt');
const joi=require('joi');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    userName:{type:String, minlength: [2, 'the name must be at least 2 latters'],maxlength: [30, 'the name must be at antil 30 latters']},
    password:{type:String,require:true,minlength: [4, 'the name must be at least 4 chars'],},
    email:{type:String,require:true,unique:true},
    address:{type:String,require:true},
    role:{type:String,default:'user',enum:['admin','user']}
})

userSchema.pre('save',function(next){

    const salt=process.env.BCRYPT_SALT |10 ;
    bcrypt.hash(this.password,salt,async(err,hashPass)=>{
        if(err)
           throw new Error(err.message);
        this.password=hashPass
        next()
    })
})

module.exports.userSchema=userSchema;
module.exports.User=mongoose.model('users',userSchema)

module.exports.userValidator ={
    loginSchema: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required()
    }),
    signUpSchema: joi.object({
        userName:joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required()
        .pattern(new RegExp('^(?=.*[A-z])(?=.*[0-9])'))
        .error(new Error('Password must contain at least one letter, one numeric digit')),
        address:joi.string().required(),
        role:joi.string().required(),
    })  
}

module.exports.generateToken=(user)=>{
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; 
    const data = { role: user.role, user_id: user._id };
    const token = jwt.sign(data, privateKey, { expiresIn: '5h' }); 
    return token;
}