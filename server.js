const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./model/shortUrl");
// const MongoClient = require("mongodb").MongoClient;

const app = express();
const router = require("express-promise-router")();
const routes = new express.Router();
//Mongoose Connection
const db = "mongodb://localhost/url-shortner";
mongoose
  .connect(db, {
    // dbName: "urlShortner",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected..."))
  .catch((error) => console.log("error connected..."));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrls = await shortUrl.findOne({ short: req.params.shortUrl });
  //if we dont get the url return the error
  if (shortUrl == null) return res.sendStatus(404).json("No URL Found");

  shortUrl.clicks++; //if there is url then increment the clicks
  await shortUrl.save(); //saving the clicks and urlshortner

  res.redirect(shortUrl.full);
});

//making our app listen to this port
const PORT = process.env.PORT || 5000;
// Listen for incoming requests
app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));
