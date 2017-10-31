// @flow

const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const Promise = require("promise");

import {getNames, writeScore, undo} from "./service"


const GoogleAuth = require('google-auth-library');

const auth = new GoogleAuth;
const CLIENT_ID = "30112827782-3e039uoc8r78iu1sbgc9o8s0live6e7d.apps.googleusercontent.com";
const client = new auth.OAuth2(CLIENT_ID, '', '');


const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cookieParser());
app.use(bodyParser.json());

app.post("/api/names", (req, res) => {
  verifyToken(req.cookies.token).then( (username) => {
      writeScore(username, req.body)
      .then(() => getNames(username))
      .then( (data) => res.json(data))
      .catch((err) => console.error(err));
  }).catch((err) => console.error(err));
});

app.post("/api/undo", (req, res) => {
    verifyToken(req.cookies.token).then( (username) => {
        undo(username, req.body)
            .then( (data) => res.json({state:"yeah"}))
            .catch((err) => console.error(err));
    }).catch(function(err) {console.log(err)});
});

app.get("/api/names", (req, res) => {
  verifyToken(req.cookies.token).then( (username) => {
      getNames(username)
      .then( (data) => res.json(data))
      .catch((err) => console.error(err));
  }).catch((err) => console.error(err));
});

app.use(express.static("build"));

app.get('*', function(req, res){
  res.redirect("/");
});

const host = '0.0.0.0';
app.listen(app.get("port"), host, () => {
  console.log(`Find the server at: http://${host}:${app.get("port")}/`); // eslint-disable-line no-console
});


function verifyToken(token) {
  return new Promise( (succ, reject) => {
    try {
      client.verifyIdToken(
        token,
        CLIENT_ID,
        function(e, login) {
          if (!login) {
		console.log("no login...", arguments);
		reject("no login..");
		return;
	  }
          const payload = login.getPayload();
          succ(payload["email"]);
      })
    } catch(ex) {
	reject(ex);
    }
  });
}

