/* @flow */

const fs = require("fs");
const _ = require("lodash");
const Promise = require("promise");
const glob = require('glob-fs')({ gitignore: true });

import {setCurrentPick, updateOrInsertRankings, getRankingsOf, getRankings, getCurrentPick, updateRankings, removeRankings} from "./dao"


const names = getAvailableNames();

console.log("Starting with so many names:", _.size(names));


function readFile(filename) {
    return _.filter(_.map(fs.readFileSync(filename, 'utf8').split("\n"), x => _.trim(x)),
			name => name !== '' && !name.includes('-'));
}

function getAvailableNames() {
  const files = glob.readdirSync('names/*.txt');
  return _.uniq(_.flatten(_.map(files, file => readFile(file))));
}


type Score = {};

function calcUpdates(toReverse, rankings) {
    const updated = _.map(rankings, ranking => {
        return {
            name: ranking.name,
            score: ranking.score - _.find(toReverse, x => x.name === ranking.name).score
        }
    });
    const grouped = _.groupBy(updated, x => x.score === 0 ? "delete" : "update");
    const toUpdate = grouped["update"];
    const toRemove = grouped["delete"];
    return {toUpdate, toRemove};
}

export function undo(username, data) {
    const lastPick = data.lastPick;
    const toReverse = data.toReverse;
    let reverseNames = _.map(toReverse, select => select.name);
    console.log("UNDO", data);

    return getRankingsOf(username, reverseNames)
        .then(rankings => {
            const {toUpdate, toRemove} = calcUpdates(toReverse, rankings);

            console.log("toUpdate ", toUpdate);
            console.log("toRemove ", toRemove);
            console.log("Setting currentPick", lastPick);

            return Promise.all([removeRankings(username, toRemove), updateRankings(username, toUpdate), setCurrentPick(username, lastPick.name)]);
        })
}


export function writeScore(username, scoring) {
  return Promise.all([maybeUpdatePicked(username, scoring),
			getRankingsOf(username, _.map(scoring, o => o.name))])
  .then( (relevant) => {
	   const result = _.map(scoring, o =>
		{ return {name: o.name, score: calcScore(o, relevant[1])} });
	   return updateOrInsertRankings(username, result);
   })
}

export function getNames(username) {
  return Promise.all([getCurrentPick(username), getRankings(username)])
  .then( (values) => {
	return getResult(values[1], values[0]);
   })
}

const calcScore = (score, scores) => {
	const found = _.find(scores, r => r.name === score.name);
	if ( found === undefined ) {
		return score.score;
	} else {
		return score.score + found.score;
	}
};


const maybeUpdatePicked = (username, body) => {
  const found =_.find(body, (rank) => rank.score === 1 );
  if ( found ){
    return setCurrentPick(username, found.name);
  }
  return Promise.resolve(false);
};


const getResult = (currentRanking, currentPick) => {
  const ranking = _.reverse(_.sortBy(currentRanking, x => x.score));
  const used = _.map(ranking, x => x.name);
  const toDo = _.difference(names, used);

  console.log("current ranking", _.size(currentRanking));
  console.log("current used", _.size(used));
  console.log("current todo", _.size(toDo));
  console.log("current pick", currentPick);

  let result = {};
  if (_.size(used) > 0) {
     let add = [];
     if (currentPick[0]) {
         add = _.uniq([currentPick[0].name, used[0]]);
     } else {
         add = _.uniq([used[0]]);
     }
     result.selection = _.shuffle(_.sampleSize(toDo, 5 - _.size(add)).concat(add))
  } else {
     result.selection = _.sampleSize(toDo, 5)
  }

  result.ranking = _.take(ranking, 10);
  result.currentPick = currentPick[0];
  return result;
};

