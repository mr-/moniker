const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const _ = require("lodash");
const Promise = require("promise");

import {getNames, writeScore} from "./service"


const GoogleAuth = require('google-auth-library');

const auth = new GoogleAuth;
const CLIENT_ID = "30112827782-3e039uoc8r78iu1sbgc9o8s0live6e7d.apps.googleusercontent.com"
const client = new auth.OAuth2(CLIENT_ID, '', '');


const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cookieParser())
app.use(express.static("build"));
app.use(bodyParser.json());

app.post("/api/names", (req, res) => {
  verifyToken(req.cookies.token).then( (username) => {
  writeScore(username, req.body)
  .then(() => getNames(username)) //That should not be needed twice..
  .then(() => getNames(username))
  .then( (data) => res.json(data))
  .catch(function(err) {console.log(err)})
  })
  .catch(function(err) {console.log(err)});
})
;

app.get("/api/names", (req, res) => {

  verifyToken(req.cookies.token).then( (username) => {
  getNames(username)
  .then( (data) => res.json(data))
  .catch(function(err) {console.log(err)})
  })
  .catch(function(err) {console.log(err)});
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});


function verifyToken(token, succ) {
  return new Promise( (succ, reject) => {
    try {
      client.verifyIdToken(
        token,
        CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {
          var payload = login.getPayload();
          var userid = payload['sub'];
          succ(payload["email"]);
          // If request specified a G Suite domain:
          //var domain = payload['hd'];
      })
    } catch(ex) {
	reject(ex);
    }
  });
}
