const _ = require("lodash");
const Promise = require("promise");

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

knex.schema.createTableIfNotExists('rankings', function (table) {
  table.string('username');
  table.string('name');
  table.integer('score');
  table.timestamps();
}) .then(function(obj) {console.log(obj)})
.catch(function(err) {console.log(err)});


knex.schema.createTableIfNotExists('currentpick', function (table) {
  table.string('username');
  table.string('name');
  table.timestamps();
}) .then(function(obj) {console.log(obj)})
.catch(function(err) {console.log(err)});


export function setCurrentPick(username, pick){
	return getCurrentPick(username).then( (currentPick) => {
	if ( _.size(currentPick) === 0 ){
		return knex('currentpick').insert({ username: username, name: pick });
	} else {
		return knex('currentpick').where({ username: username }).update({ username: username, name: pick });
	}})
}


export function updateOrInsertRankings(username, rankings) {
	const toInsert = _.map(rankings, r => {return {username: username, name: r.name, score: r.score }});
	getRankingsOf(username, _.map(toInsert, o => o.name))
        .then( (indb) => {
	  const foo = _.partition( toInsert, (r)  => undefined === _.find(indb, o => o.name === r.name ) );
          let promises = [];
          if (_.size(foo[0]) > 0) {
		promises = _.concat(promises, [knex('rankings').insert(foo[0])]);
	  }
          if (_.size(foo[1]) > 0) {
		const updates = _.map(foo[1], up => knex('rankings').where({username:username, name:up.name}).update("score", up.score));
		promises = _.concat(promises, updates);
	  }
          return Promise.all(promises);
	});
}

export function updateRankings(username, rankings) {
    return Promise.all(_.map(rankings, ranking => knex('rankings').where({username:username, name:ranking.name}).update("score", ranking.score)));
}

export function removeRankings(username, rankings) {
	return Promise.all(_.map(rankings, ranking => knex('rankings').where({username:username, name:ranking.name}).del()));
}

export function getRankingsOf(username, names){
	return knex('rankings').where({ username: username }).andWhere('name', 'in', names)
		.select("name", "score");
}

export function getRankings(username){
	return knex('rankings').where({ username: username }).select("name", "score");
}

export function getCurrentPick (username)  {
	return knex('currentpick').where({ username: username }).select("name");
}
