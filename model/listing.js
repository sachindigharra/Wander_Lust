const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { required } = require("joi");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:'Review'
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type:String,
    enum:['Mountains','Trending','Rooms','Iconiccities','Castles','Arctic','Farms','Camping'],
    required:true
  }
});
//<--- Mongoose post Middleware For Deleting reviews of Product after Removing Listing-->
listingSchema.post('findOneAndDelete',async(listing)=>{
   if(listing){
       let data = await Review.deleteMany({_id:{$in:listing.reviews}})
       console.log(data);
   }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;