//required packages
const express = require("express");
// const axios = require('axios');
const { response } = require("express");
const bp = require('body-parser')
const fetch = require('node-fetch');
const path= require('path')
// const img = import('./public/Images/ytmp3.png')

require("dotenv").config();

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}


//create the express server
const app = express();
app.use(bp.urlencoded({extended:true}))


const hostname = process.env.HOST || "0.0.0.0"


//server port number
const PORT = process.env.PORT || 3000;

// Set template engine
app.set("view engine", "ejs");

app.use(express.static('public'));

// Needed to parse html data for POST requests
app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());

app.get("/",(req, res) => {
    res.render("index")

})
app.get("/about", async(req,res)=>{
  res.render("about")
})
app.get("/contact",async(req,res)=>{
  res.render("contact")
})
app.get("/PP", async(req,res)=>{
  res.render("PP")
})
app.post("/", async (req, res) => {
    const videoId = req.body.videoID;
   const id= youtube_parser(videoId);
   var nid=id;
    if(
    videoId === undefined ||
    videoId === "" ||
    videoId === null
  ){
    return res.render("index", { success : false, message : "Please paste a video Link"});
  }
  else{

    
//VIDEO
const url1 = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${id}`;
const options1 = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.N_API_KEY,
    'X-RapidAPI-Host': process.env.N_API_HOST
  }
};

try {
	const response1 = await fetch(url1, options1);
	var result1 = await response1.json();
	// console.log(result1)
} catch (error) {
	console.error(error);
}
//AUDIO

const url2 = ` https://youtube-mp36.p.rapidapi.com/dl?id=${id}`;
const options2 = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.API_KEY,
    'X-RapidAPI-Host': process.env.API_HOST
  }
};

try {
	const response2 = await fetch(url2, options2);
	var result2 = await response2.json();
	// console.log(result2);
} catch (error) {
	console.error(error);
}




    }
    var vts = String(result1.title)
    const vt = vts.slice(0,25)
    const vtr = vt.concat("....")
  const vurl720=  result1.formats[2].url;
  const vurl360=  result1.formats[1].url;
  const mp3url = result2.link;
  return res.render("index",{ success : true,  song_title : vtr, song_link : result1.link,v:vurl720,nid:nid,m:mp3url,lq:vurl360})
})







//start the server
app.listen(3000,hostname, () => {
    console.log(`server started on port ${PORT}`);
})