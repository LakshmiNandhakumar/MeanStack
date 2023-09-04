const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({

    userName : {
        type: String,
        lowercase : true,
        unique : true,
        required : true
    },
    password : {
        type: String,
        required: true,
        minLength: 8,
    },
    email : {
        type: String,
        unique : true,
        required : true
    }
});

UserSchema.pre("save",function(next){
    const user = this;
    bcrypt.hash(user.password,null,null,function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};



module.exports = mongoose.model('User',UserSchema);