//jshint esversion: 6
//practice version of the app.js version
//they are the same 

const express =require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

let listItems= [];
app.get('/', (req, res)=>{
   const date = new Date();
   const options={
      weekday: 'long',
      day: 'numeric',
      month: 'long'
   };
   const day = date.toLocaleDateString('en-US', options);

   res.render('home', {
      day: day,
      listItems: listItems
   });
   
});


app.post('/', (req, res)=>{
   listItems.push(req.body.newItem);
   res.redirect('/');
});


app.listen(3000, ()=> console.log('listening on port 3000'));
