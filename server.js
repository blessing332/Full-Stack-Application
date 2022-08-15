//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const profileSeed = require('./models/profileSeed.js')
const Date = require('./models/schema.js')
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

////////////// Create DB //////////////////
// app.get('/datedb', (req, res)=>{
//   Date.create(profileSeed, (err, data) => {
//       res.send(data);
// })
//})
//  Date.collection.drop()
  //
  Date.countDocuments({}, (err, data) => {
    if (err){ console.log(err.message)}
    else {
    console.log(`There are ${data} in this database`)}
  })
///////////////////////////////////

//___________________
// Routes
//___________________
//localhost:3000
// app.get('/' , (req, res) => {
//   res.send('Hello World!');
// });

app.put('/datedb/:id', (req, res) => {
    if (req.body.isInterested === 'on') {
        req.body.isInterested = true;
    } else {
        req.body.isInterested = false;
    }

    Date.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updateModel) => {
        res.redirect('/datedb')
    })
})

app.get('/datedb/:id/edit', (req, res) => {
    Date.findById(req.params.id, (error, foundDates) => {
    res.render(
        'edit.ejs', { name: foundDates })
    })
})

app.delete('/datedb/:id', (req, res) => {
    Date.findByIdAndRemove(req.params.id, (error, data) => {
        res.redirect('/datedb');
    })
    // res.send('deleting...')
})

app.get('/datedb/new', (req, res)=>{
  res.render('new.ejs')
})

app.get('/datedb', (req, res) => {
  //res.send("working")
    Date.find({}, (error, allDates) => {
      console.log(allDates);
        res.render(
             'index.ejs', { name: allDates },
         )
     })
})
app.post('/datedb', (req, res) => {
    Date.create(req.body, (error, createdDates) => {
        if (req.body.isInterested === 'on') {
            req.body.isInterested = true;
        } else {
            req.body.isInterested = false;
        }
        Date.create(req.body, (error, createdDates) => {
            res.redirect('/datedb')
        })
    })
})

// app.get('/datedb/:id', (req, res) => {
//     Date.findById(req.params.id, (error, foundDate) => {
//         res.render(
//             'show.ejs', { budget: foundDate }
//         )
//     })
// })
//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));

mongoose.connect('mongodb://127.0.0.1:27017/Full-Stack-Application', () => {
    console.log('The connection with mongod is established')
  })
