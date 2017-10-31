/* @flow */


const _ = require("lodash");
const Promise = require("promise");

import type {Rankings} from "./Types"

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

const table = {
    rankings: "rankings",
};



knex.schema.createTableIfNotExists(table.rankings, function (table) {
    table.string('username');
    table.increments('id');
    table.text('rankings');
    table.dropPrimary();
}) .then(function(obj) {console.log(obj)})
    .catch(function(err) {console.log(err)});

export function insertRankings(username : string, rankings : Rankings) {
    return knex(table.rankings).insert({username: username, rankings: JSON.stringify(rankings)})
}

export function removeRankings(username : string, id : number) {
    return knex(table.rankings).where({username:username, id:id}).del();
}

export function readRankings(username : string){
    return knex(table.rankings).orderBy("id", "desc").where({ username: username }).select("id", "rankings")
		.then((data) => _.map(data, x => {return {id:x.id, rankings:JSON.parse(x.rankings)}}));
}


export function getMaxId(username : string) {
	return knex(table.rankings).where({username: username}).max("id as id").then((data) => data[0]);
}


export function clean () {
	return Promise.all(_.map(table, (name) => knex(name).truncate()));
}