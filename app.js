const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require('./models/listing'); // Import the Listing model
const path = require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/stayzy', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//INDEX Route
app.get('/listings', async (req, res) => {
    const allListing = await Listing.find({});
    res.render('listings/index.ejs', { allListing });

});

//New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route
app.get('/listings/:id', async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
});

//Create Route
app.post('/listings', async (req, res, next) => {
    try {
        const listingData = req.body.listing;
        listingData.image = {
            filename: "custom",
            url: listingData.image
        };
        const newListing = new Listing(listingData);
        await newListing.save();
        res.redirect('/listings');
    }
    catch (err) {
        next(err);
    }
});

//edit Route
app.get('/listings/:id/edit', async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});

//Update Route
app.put('/listings/:id', async (req, res) => {
    const id = req.params.id;
    const listingData = req.body.listing;
    // Convert image string to object
    listingData.image = {
        filename: "custom", // or leave blank if not needed
        url: listingData.image
    };
    const listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });
    res.redirect(`/listings/${listing._id}`);
})

//Delete Route
app.delete('/listings/:id', async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000/listings');
});