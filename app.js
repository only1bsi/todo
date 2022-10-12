  //jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
// const date = require("./date");
// const Date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();
const _ = require("lodash")


const items =[];
const workItems =[];

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/todolistDB');


const itemSchema = { 
  name: String, 
 }
 

 const Item =  mongoose.model("Item", itemSchema);

 const Item1 = new Item({
   name: "go to ahmed plaza for your  meeting",
  });
  
  const Item2 = new Item({
    name: "come back anf find a figma file",
   });

   const Item3 = new Item({
    name: "finish the Divi tutorials.",
   });
   
   const defaultItems = [Item1, Item2, Item3]

   const listSchema = {
    name: String,
    items: [itemSchema]
   };

   const List =  mongoose.model("List", listSchema);

app.get("/", function(req, res){
 // const day = date.getDay();
  Item.find({},function(err, foundItems){ 
 if(foundItems.length === 0){

   Item.insertMany(defaultItems, function(err){
    if(err){
      console.log(err)
    }else{
      console.log("perfect")
    }
   })
   res.redirect("/")
 }else{
  res.render("list", {listTitle: "Today", newListItems: foundItems})
 }
   
  });
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName)

  List.findOne({ name: customListName }, function (err, foundList) {
    if(!err){
      if(!foundList){
        // create an new list
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        list.save()
        res.redirect("/" + customListName)
      }else{
        // show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  });

})




app.post("/", function(req, res){

      const itemName = req.body.newItem;
      const listName = req.body.list;
                                    
      const item = new Item ({
        name: itemName
      })
      if(listName === "Today"){
        item.save(); 
      res.redirect("/");
    } else{
      List.findOne({name:listName}, function(err, foundList){
        foundList.items.push(item)
        foundList.save();
        res.redirect("/" + listName)
      })
    }
    


      // if (req.body.list) {
      //   workItems.push(item);
      //  res.redirect("/");
      // } else {
      //   items.push(item);
      //   res.redirect();
      // }
});


app.post("/delete", function(req, res){
  
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){

    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
         console.log("perfect")
       }
       res.redirect("/")
   }); 
  } else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundLists){
      if(!err){
        res.redirect("/" + listName)
      }
    });
  }

 
});


// app.get("/work", function(req, res) {
//     res.render("list", {listTitle: "work list", newListItems: items})
// });

// app.get("/about", function(req, res){
//  res.render("about");
// });

// app.post("/work", function(req, res) {
//     let item = req.body.newItem
//     workItems.push(item)
//     res.redirect("/work")
// });


app.listen(3000, function(req, res){
    console.log("server starte4d at port 3000")
});