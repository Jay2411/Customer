const { json } = require("express");
const express = require("express");
const { request } = require("http");
const path = require("path");
const app = express();
const { MongoClient } = require("mongodb");
var ObjectId = require('mongodb').ObjectID;
require("./src/db/conn");

const Customer = require("./src/models/customer");
const { isValidObjectId } = require("mongoose");

const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const static_path = path.join(__dirname, "../");
app.use(express.static(static_path))


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/edit.html', function (req, res) {
  res.sendFile(__dirname + '/views/edit.html')
})

//api for add customer
app.post("/add", async (req, res) => {
  try {
    const customerDetail = new Customer({
      id: req.body.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      city: req.body.city,
      company: req.body.company
    })

    const customered = await customerDetail.save();
    res.redirect("/");
  }
  catch (error) {
    res.redirect("/")
  }

});

//api for find by id
app.get("/find", async (req, res) => {
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("customer");
    dbo.collection("customers").find({_id:ObjectId(req.body.id)}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
});

//api for find by name and city
app.get("/findby", async (req, res) => {
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("customer");
    dbo.collection("customers").find({"first_name":req.body.first_name,"last_name":req.body.last_name,"city":req.body.city}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
});

//api for update customer
app.post("/edit", async (req, res)=>{
  try {
      const updateDocument = async(_id)=>{
          try{
              const result = await Product.findByIdAndUpdate({_id},{
                  $set : {
                    id: req.body.id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    city: req.body.city,
                    company: req.body.company
                  }
              },{
                  new :true,
                  useFindAndModify : false
              });
              res.redirect("/")
              console.log("Updated");
          }
          catch(err){
              console.log("error");
          }
      }
      updateDocument(req.body.id);
  } 
  catch (error) {
      console.log("error");    
  }
})

//api for delete customer
app.post("/delete", async (req, res)=>{
  try {
      const deleteDocument = async(_id)=>{
          try{
              const result = await Customer.findByIdAndDelete({_id});
              res.redirect("/")
              console.log("Updated");
          }
          catch(err){
              console.log("error 6 ne");
          }
      }
      deleteDocument(req.body.id);
  } 
  catch (error) {
      console.log("aato error ni 6");    
  }
})

app.listen(port, () => {
  console.log('server is running now');
})