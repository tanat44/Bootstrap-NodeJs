// EXPRESS
import { NextFunction, Request, Response } from "express";
var express = require('express');
var app = express();

// Middle
app.use(express.json())
app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
});

// MONGO
import { Db } from "mongodb";
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017";
const client = new MongoClient(url, {
    useUnifiedTopology: true
})
const dbName: String = 'preparation2';
var db: Db;
client.connect(function (err: Error) {
    if (err) throw err;
    db = client.db(dbName)
    app.listen(3000);
    console.log(`=============\nListening on 3000, Mongo connected to ${url}\n=============` );
})

// Types
import {BaseProduct, Product, Products} from "./product.interface";

// Endpoint
app.post('/product', async function( req: Request, res: Response){
    const body = req.body;
    try {
        await db.collection('products').insertOne(body);
    } catch (e) {
        console.log(e);
        res.send({ok: false});
    }
    res.send({ok: true});
});

app.get('/product', async function (req: Request, res: Response) {
    const query = req.query;
    let limit: number = 5;
    if (query && query.maxCount) {
        const maxCount: number = parseInt(query.maxCount as string);
        if (maxCount < limit) {
            limit = maxCount;
        }
    }
    try {
        let result: Product[] = [];
        result = await db.collection('products').find().limit(limit).toArray();
        let output = {
            products: result,
            count: result.length
        }
        res.send(output);

    } catch (e) {
        console.log(e);
        res.send({ok: false});
    }
});

app.get('/test', async function( req: Request, res: Response){
    res.send({ok: true, msg: 'helloWorld'})
});