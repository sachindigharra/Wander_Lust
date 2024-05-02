const Listing=require('../model/listing.js')
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });


module.exports.index=async (req, res,next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm=(req,res,next)=>{
    res.render('listings/new.ejs')
};


module.exports.createListing=async(req,res,next)=>{

   let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
    let url=req.file.path;
    let filename=req.file.filename;
    // server validation form scehma or info gathering
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        newListing.geometry=response.body.features[0].geometry;
        let sl = await newListing.save();
        console.log(sl)
        res.redirect('/listings')
};
module.exports.showListing=async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash('error',' Listing you requested for does not exists')
        res.redirect('/listings')
    }
    res.render("listings/show.ejs", { listing });
};
module.exports.renderEditForm=async (req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash('error',' Listing you requested for does not exists')
        res.redirect('/listings')
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_200");
    res.render('listings/edit.ejs',{listing,originalImageUrl })
};
module.exports.editListing=async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
    if(typeof req.file!=='undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save()
    }
    console.log(response.body.features[0].geometry)
    listing= await Listing.findByIdAndUpdate(id,{geometry:response.body.features[0].geometry})
    
    req.flash('success',' Listing Updated ')
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    req.flash('success','New Listing Deleted ')
    res.redirect('/listings')
};
module.exports.filterListing=async(req,res,next)=>{
    let {id}=req.params;
    let allListings=await Listing.find({category:id});
    if(allListings.length>0){
        return res.render("listings/index.ejs", { allListings });
    }
    else{
        res.redirect('/listings');
    }
}
module.exports.searchDestination=async(req,res,next)=>{
    let {destination}=req.body;
    let  allListings= await Listing.find({location:destination})
    if(allListings.length>0){
        req.flash('success','this result is near by You!');
        return res.render("listings/index.ejs", { allListings })
    }
    else{
        req.flash('error','Sorry! your location is outoff reach')
        res.redirect('/listings')
    }
}