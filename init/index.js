//THis is to connect mongo and intialize database with data from data.js

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//Connection to mongo DB
main()
.then(()=>{
    console.log("connectes to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//Functoin to insert db first by clearing all data and then inserting data using insert many
const initDb = async () => {
  try {
      // Delete all existing listings
      await Listing.deleteMany({});

      // Modify initData.data to include an "owner" field
      const modifiedData = initData.data.map((obj) => ({ ...obj, owner: '65e88118db64bee5c07ebeb9' }));

      // Update the category field for each object in modifiedData
      const updatedData = modifiedData.map((obj) => ({ ...obj, category: 'Mountain' }));

      // Insert the modified data into the database
      await Listing.insertMany(updatedData);

      console.log("Data was initialized");
  } catch (error) {
      console.error("Error initializing data:", error);
  }
}


initDb(); //Callin the function

//While running go to init folder and then run