if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const { createApi } = require('unsplash-js');
const { nodeFetch } = require('node-fetch');

mongoose.connect(process.env.MONGODB_SERVER)
    .then(() => {
        console.log('MongoDB connected');
    }).catch(err => console.log("failed to connect to MongoDB", err));

const unsplash = createApi({
    accessKey: 'BHf4RkFxOVjK7JsQfHhcBMzaJEe4WekQJPLByh1EBe4',
    fetch: nodeFetch,
});

const getRandomImags = (num) => {
    return unsplash.photos.getRandom({
        count: num,
        query: 'camping',
        orientation: 'landscape',
    }).then((result) => {
        if (result.errors) {
            console.log('Error occurred: ', result.errors[0]);
        } else {
            const photos = result.response;
            return photos.map(photo => {
                return { url: photo.urls.full };
            });
        }
    }).catch(error => {
        console.error('Error fetching photos:', error);
    });
    return []; // Return an empty array in case of error
}

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    const images = await getRandomImags(30);
    let n = 0;
    for (let i = 0; i < 15; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '67f6b4aeff6df3e41fca032c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: images[n].url,
                    filename: 'YelpCamp/dekcmid2txhlmzdiy03c',
                },
                {
                    url: images[n + 1].url,
                    filename: 'YelpCamp/dekcmid2txhlmzdiy03c'
                }
            ],
        })
        n += 2;
        console.log(camp);
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})