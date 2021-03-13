const express = require("express");
const path = require("path");
const app =  express();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Contactdance', {useNewUrlParser: true, useUnifiedTopology: true});
const port=8000;

//define mongoose schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  desc: String
});
const Contact = mongoose.model('Contact', ContactSchema);

//express specific part
app.use('/static',express.static('static')) //for serving static files
app.use(express.urlencoded())

//pug specific part
app.set('view engine','pug') //set template engine as pug
app.set('views',path.join(__dirname,'views')) //set the views directory

//endpoints
app.get('/',(req,res)=>{
	const params={ }
	res.status(200).render('home.pug',params) //changed app.js to home.pug
})
app.get('/contact',(req,res)=>{
	const params={ }
	res.status(200).render('contact.pug',params) //changed app.js to contact.pug
})

//post method
app.post('/contact',(req,res)=>{
	var myData= new Contact(req.body);
	myData.save().then(()=>{
		res.send("This item has been saved to the database")
	}).catch(()=>{
		res.status(400).send("Item was not saved to the database")
	});
	//res.status(200).render('contact.pug') //changed app.js to home.pug
})

//start on the server
app.listen(port,()=>{
	console.log("The app has started on port "+port);
});