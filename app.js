const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;
const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";


//database connection
//const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongo_url);
}
main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
})
//test listing
// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"kalaiya",
//         country:"nepal",

//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res .send("successfull testing");
// });

//home route
app.get("/",(req,res)=>{
    res.send("HOME:🏠")
})
//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");

});
//show route
app.get("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    } catch (error) {
        res.send(error);
    }
});
//create route
app.post("/listings", async (req, res) => {
    let { title, description, price, location, country, image } = req.body;
    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image,
    });
    await newListing.save();
    res.redirect("/listings");
    console.log(newListing);
});
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

});
//update route
app.put("/listings/:id",async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);

});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
});
//server


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

