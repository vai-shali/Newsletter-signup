// npm install @mailchimp/mailchimp_marketing
//mailchimp api key- b311002e376b11b3a233c1c552e69dfe-us11
//list ID- aac89aaffd

const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
// const request= require("request");
// const https= require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //put stylesheets, images into public folder for it to be accessed by the localhost server

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "b311002e376b11b3a233c1c552e69dfe-us11",
  server: "us11"
});

app.post("/", function(req, res) {

  const listid = "aac89aaffd";
  const subscribingUser = {
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email
  };

  async function run() {
    try{
      const response = await mailchimp.lists.addListMember(listid, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log("subscribed");
      res.sendFile(__dirname + "/success.html");
    }
    catch(e){
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
