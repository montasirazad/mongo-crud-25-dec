const express = require('express');
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
const ObjectID = require('mongodb').ObjectId


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://azad:azad1403@cluster0.wov4a.mongodb.net/organic-product?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("organic-product").collection("items");
    console.log('Database Connected');

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })




    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log('added');
                res.redirect('/')
            })
        // console.log(product);
    })

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectID(req.params.id) },

            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })



    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectID(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0)
            })

    })

});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


app.listen(8080, () => {
    console.log('listening at port 8080');
});