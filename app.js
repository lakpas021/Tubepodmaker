// Rewuired Packages
const { render } = require("ejs");
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
 
//Create the Express Servern
const app = express();

//Indicating the server port number
const PORT = process.env.PORT || 3000;

//Set Template Engine
app.set("view engine", "ejs");
app.use(express.static("Public"));

//needed to prase html data for POST request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

//Creating Routes
app.get("/" , (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.VideoID;
    if(
        videoId === undefined ||
        videoId === "" ||
        videoId === null
      ){
        return res.render("index", { success : false, message : "Please enter a video ID"});
      } else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method": "GET",
            "headers": {
              "x-rapidapi-key": process.env.API_KEY,
              "x-rapidapi-host": process.env.API_HOST
              }
          });
      
          const fetchResponse = await fetchAPI.json();
       
          if(fetchResponse.status === "ok")
            return res.render("index",{ success : true,  song_title : fetchResponse.title, song_link : fetchResponse.link})
          else
            return res.render("index", { success : false, message : fetchResponse.msg});
        }
       });

//Start the server
app.listen(PORT, () => {
   console.log("server started on the port ${PORT}");
})
