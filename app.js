//jshint esversion: 6

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { static } = require('express');
const { fileLoader } = require('ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
const _ = require('lodash');

const date = require(__dirname+'/date.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin-davidballad:32865Mazda@cluster0-njzxa.mongodb.net/todoDB', {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
   name: String
});


const Item = mongoose.model('Item', itemSchema);


app.get('/', (req, res)=>{
      Item.find({},(err, item)=>{
         if(err) console.log(err);
         res.render('home', {
            listName: 'Today',
            newItems: item
         });
      });
      
});

const listSchema = new mongoose.Schema({
   pageTitle: String,
   itemList: [itemSchema]
});

const List = new mongoose.model('List', listSchema);




app.post('/', (req, res)=>{
   const listName = req.body.listName;
   if(req.body.newItem === ''){

      if (req.body.listName === 'Today') {
         res.redirect('/');
      } else {
         res.redirect('/'+listName);
      }

   } else {
      
      const item = new Item({
         name: req.body.newItem
      });
   
      if(listName === 'Today'){
         
         item.save();
   
         res.redirect('/');
      } else{
         // console.log(item);
         List.findOne({pageTitle: req.body.listName},(err, list)=>{
            list.itemList.push(item);
            list.save();
            res.redirect('/'+listName);
         });
         
      }

   }
   
   
});


app.get('/:customName', (req, res)=>{
   const newTitle = _.capitalize(req.params.customName);

   List.findOne({pageTitle:newTitle}, (err, list)=>{
      if(!list){
         console.log('not found: created');
         const otherList = new List({
            pageTitle: newTitle,
            itemList:[{name: "New ToDoList Created"}]    
            
         });
         otherList.save();
         res.redirect('/'+newTitle);
      } else{
         console.log('found');
         //console.log(list.itemList);
         res.render('home', {
            listName: newTitle,
            newItems: list.itemList
         });
         
      }
         
         
        
   });
   
});

app.post('/delete', (req, res)=>{
   const itemToDelete = req.body.delItem[1];
   const listPage = req.body.delItem[0];

      if(listPage === 'Today'){
         Item.deleteOne({name: itemToDelete}, (err)=>{
            if(err) console.log(err);

               res.redirect('/');
         });
      } else{
         List.findOneAndUpdate({pageTitle: listPage},{$pull:{itemList: {name: itemToDelete}}}, (err, list)=>{
               if(!err){
                  res.redirect('/'+ listPage);
               }
         });
      }

         
   
});






app.get('/about', (req, res)=>{
   res.render('about');
});

app.listen(process.env.PORT||3000, ()=>
   console.log('listening on port 3000')
);