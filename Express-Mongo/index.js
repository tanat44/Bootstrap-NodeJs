// EXPRESS
var express = require('express');
var app = express();

// EXPRESS Middleware 
app.use(express.json());

app.use(function (req, res, next) {         //for API debugging
    console.log(`${req.method} ${req.url}`);
    next();
});

// MONGO
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017";
const client = new MongoClient(url, {
    useUnifiedTopology: true
})
const dbName = 'test';
var db;
client.connect(function (err) {
    if (err) throw err;
    db = client.db(dbName)
    app.listen(3000);
    console.log(`=============\nListening on 3000, Mongo connected to ${url}\n=============` );
})

// APIs
app.get('/employee', async function (req, res) {
    try {
        const result = await db.collection('employee').find({}, {_id: 0}).toArray();
        res.send(result);
    } catch (err) {
        res.send({ok: false});
    }
});

app.get('/employee/:firstname', async function (req, res) {
    try {
        const firstname = req.params.firstname;
        const result = await db.collection('employee').find({firstname: firstname}).toArray();
        res.send(result);
    } catch (err) {
        res.send({ok: false});
    }
})

app.post('/employee', async function(req, res) {
    const body = req.body;
    body.createDate = new Date();
    try {
        await db.collection('employee').insertOne(body);
    } catch (err) {
        console.log(err);
        res.send({ok: false});
    }
    res.send({ok: true});
})

app.patch('/employee/:id', async function (req, res) {
    const body = req.body;
    const id = req.params.id;
    try {
        await db.collection('employee').updateOne({_id: ObjectID(id)}, {$set: body})
    } catch (err) {
        console.log(err);
        res.send({ok: false});
    }
    res.send({ok: true});
})


app.delete('/employee/:id', async function(req, res) {
    const id = req.params.id;
    try {
        await db.collection('employee').deleteOne({_id: ObjectID(id)})
    } catch (err) {
        console.log(err);
        res.send({ok: false});
    }
    res.send({ok: true});
})
