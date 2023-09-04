require('dotenv').config();
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const appRoutes = require('./app/routes/api')(router);
const path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);

const connectionString = process.env.MONGOURL;
mongoose.connect(connectionString)
.then(()=> console.log("Successfully connected to the Database"))
.catch((error)=>console.log("Not connected to the Database"));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
});