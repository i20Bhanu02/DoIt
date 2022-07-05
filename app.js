const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistv2DB");

const itemSchema = {
    name : String,
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name : "Click + to add",
})

const item2 = new Item({
    name : "<- Click here to Check",
})

const item3 = new Item({
    name : "Click to delete ->",
})

const itemArray = [item1, item2, item3];

let day = date();

app.get("/",function(req,res){
    

    Item.find({}, function(err,items){
        if(items.length === 0){
            Item.insertMany(itemArray, function(err){
            if(err) console.log(err);
            else console.log("Inserted Succesfully");
            });
            res.redirect("/");
        }
        else res.render("list", {kod :day, items:items});
    })    
})


app.get("/about",function(req,res){
    res.render("about");
})

const listSchema = {
    name : String,
    items : [itemSchema],
}

const List = mongoose.model("List",listSchema);

app.get("/:word",function(req,res){
    const word = _.capitalize(req.params.word);

    List.findOne({name : word}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name : word,
                    items : itemArray,
                })
                list.save();
                res.redirect("/"+word);
            }
            else{
                res.render("list" , {kod : foundList.name , items : foundList.items})
            }
        }
    })

})



 
app.post("/",function(req,res){
    const nItem = new Item({
        name : req.body.newItemName,
    })
    if(req.body.list == day){
        nItem.save();
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name : req.body.list},{$push :{items : nItem}}, function(err){
            if(err) console.log(err);
        });
        res.redirect("/"+req.body.list)
    }
    
   
})


app.post("/delete", function(req,res){
    const id = req.body.delbtn;
    const list = req.body.list;

    if(list == day){
        Item.deleteOne({_id : id} , function(err){
            if(err) console.log(err); 
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name : list}, {$pull :{items : {_id : id}}}, function(err){
            if(err) console.log(err);
        });
        res.redirect("/"+list);
    }

})


app.listen(3000,function(){
    console.log("Server running on port 3000");
})