const rp = require("request-promise");
const Database = require("replpersist");
const express = require("express");
const { readFileSync } = require("fs");
const app = express();
const port = 3000;
const webs = new Database("webs");

webs.data = [];
webs.data[0] = {url: "https://replit.com/@ThatCoder1", title: "example"}
let h = "";
let extra = `<p>Reload if page not loading.</p>`

app.get("/style.css", (req, res)=>{ 
  res.send(readFileSync("./style.css", "utf-8")) 
})

app.get("/", (req, res) => {
  // Send homepage
  res.send(readFileSync("index.html", "utf-8"))
})

app.get("/search/:url", (req, res)=>{
  if (req.params.url.indexOf(" ") !== -1) {
    res.redirect("/browse/" + req.params.url);
  } else if (webs.data[webs.data.length-1].url !== req.params.url) {
    url = "https://" + req.params.url;
    webs.data.push({"url": req.params.url})
    rp(url)
      .then(function(html){
        console.log(html)
        h = html.toString();
        webs.data[webs.data.length-1].title = html.split("<title>")[1].split("</title>")[0]
        console.log(webs.data)
      })
      .catch(function(err){
        // deal with it
      })
    console.log(h)
    res.send(h)
  } else {
    rp("https://" + req.params.url)
      .then(function(html){
        console.log(html)
        h = html.toString();
        webs.data[webs.data.length-1].title = html.split("<title>")[1].split("</title>")[0]
        console.log(webs.data)
      })
      .catch(function(err){
        // deal with it
      })
    console.log(h)
    res.send(h)
  }
  // Reset page for next search
  html = ""
  html$ = ""
})

app.get("/browse/:searchterm", (req, res)=>{
  let tosend = "";
  for (each in webs.data) {
    if (JSON.stringify(webs.data[each]) == undefined) {
      continue;
    } else {
      if (webs.data[each].title.toLowerCase().indexOf(req.params.searchterm.toLowerCase()) !== -1) {
        tosend += `
        <div style="background-color:#202020"><h2 style="color:lightblue">${webs.data[each].title}</h2><br><a href="https://browser.thatcoder1.repl.co/search/${webs.data[each].url}">${webs.data[each].url}</a></div>
        `
      }
    }
  }
  res.send(tosend)
})

app.listen(port, ()=>{
  console.log("port = 3000")
})

// Don't try minecraft.net; Does not work