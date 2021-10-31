var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');

var userSchema=new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true,minlength:5},
},{timestamps:true})


//pre(save)hook
userSchema.pre('save',function(next){
    console.log(this,'before saving into database');
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashed)=>{
            if(err)return next(err);
            this.password=hashed;
             return next()
        })
        
    }else{
        next();
    }

})

//method
userSchema.methods.verifyPassword=function(password,cb){
    bcrypt.compare(password,this.password,(err,result)=>{
        return cb(err,result);
    })
}



module.exports=mongoose.model('User',userSchema);