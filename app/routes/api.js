const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = 'hello';

module.exports = function(router){
    //user registration
    router.post('/users',(req,res)=>{
        const user = new User();
        user.userName = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        //console.log(req.body);
        if(req.body.username == null){
            //res.send("Please provide a username");
            res.json({success:false,message:'Please provide a username'});
        }
        else if(req.body.password == null ){
           // res.send("Please provide a password");
           res.json({success:false,message:'Please provide a password'});
        }
        else if(req.body.email == null ){
            //res.send("Please provide a email");
            res.json({success:false,message:'Please provide a email'});
        }
        else{
            user.save()
            .then(()=>{
                //res.send("user created!");
                res.json({success:true,message:'user created!'});
            })
            .catch((error)=>{
                //res.send(`username or email is already exist ${error}`);
                res.json({success:false,message:`username or email is already exist \n ${error}`});
            });
        }

            /*
            try{
                //const user1 = user.save();
                //res.status(200).json(user1);
                user.save();
                res.send("user created!");
            }
            catch(error){
                //res.status(400).json({message:error.message});
                res.send(`username or email is already exist ${error}`);
            }*/
           
      //  }
    });

    //user login

    router.post('/authenticate',(req,res)=>{

        if(req.body.username == null){
            //res.send("Please provide a username");
            res.json({success:false,message:'Please provide a username'});
        }
        else if(req.body.password == null ){
           // res.send("Please provide a password");
           res.json({success:false,message:'Please provide a password'});
        }else{

        
        User.findOne({userName : req.body.username}).select('userName password email')
        .exec()
        .then((user)=>{
            if(user){
                const validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({success: false,message:'Could not authenticate the password!'})
                }
                else if(validPassword){
                    const token = jwt.sign({username : user.userName , email : user.email},secret,{expiresIn: '24h'});
                    res.json({success: true,message:'User authenticated!',token: token});
                }
            }
            else if(!user){
                res.json({success:false,message:'Could not authenticate the user!'});
            }
            })
            .catch((error)=>{
                res.status(500).json({success:false,message:error.message});
            });
        }
        });
        


        //decrypt the token

        router.use(function(req,res,next){
            const token = req.body.token || req.body.query || req.headers['x-access-token'];

            if(token){
                //verify
                jwt.verify(token, secret, function(err, decoded) {
                    if(err){
                        res.json({success:false,message:'Token invalided'})
                    }
                    else{
                        req.decoded = decoded; // send the username and email
                        next();
                    }
                  });
            }
            else{
                res.json({success:false,message:'No token provided'})
            }
        })

        //current user

        router.post('/currentuser',(req,res)=>{
            res.send(req.decoded);
        });
       
    return router;
}
