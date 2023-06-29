const mongoose = require('mongoose');
const axios = require('axios')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0 ; i< 50; i++){

        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const res = await axios.get(
            'https://api.unsplash.com/photos/random?client_id=rHVAN3HD6q7s-51lQ3NlV9PAWsizk2U0gwbPcANRHLY&collections=9046579'
        )
        
        const image = res.data.urls.small

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum iusto quae repudiandae harum itaque iste a ducimus maiores non fuga nam, delectus odio! Ad minus magni perspiciatis? Accusamus, libero eum.',
            price,
            image
        })
        await camp.save()
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})
