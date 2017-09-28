const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const Promise = require("promise");

import {setCurrentPick, updateOrInsertRankings, getRankingsOf, getRankings, getCurrentPick} from "./dao"


const names = _.filter(_.uniq(_.map(fs.readFileSync('schwedische_namen.txt', 'utf8').split("\n"), x => _.trim(x))), name => name !== '');


export function writeScore(username, scoring) {
  return Promise.all([maybeUpdatePicked(username, scoring),
			getRankingsOf(username, _.map(scoring, o => o.name))])
  .then( (relevant) => { console.log("Relevant", relevant);
	   const result = _.map(scoring, o =>
		{ return {name: o.name, score: calcScore(o, relevant[1])} });
	   console.log("Posting result", result);
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
}


const maybeUpdatePicked = (username, body) => {
  const found =_.find(body, (rank) => rank.score === 1 )
  if ( found ){
    console.log("maybe update with", found);
    return setCurrentPick(username, found.name);
  }
  return Promise.resolve(false);
}


const getResult = (currentRanking, currentPick) => {
  const ranking = _.reverse(_.sortBy(currentRanking, x => x.score));
  const used = _.map(ranking, x => x.name)
  const toDo = _.difference(names, used)

  console.log("current ranking", currentRanking);
  let result = {};
  if (_.size(used) > 0) {
     let add = []
     if (currentPick[0]) {
         add = _.uniq([currentPick[0].name, used[0]]);
     } else {
         add = _.uniq([used[0]]);
     }
     console.log("Adding", add);
     result.selection = _.shuffle(_.sampleSize(toDo, 5 - _.size(add)).concat(add))
  } else {
     result.selection = _.sampleSize(toDo, 5)
  }

  result.ranking = _.take(ranking, 10);
  console.log("Returning result", result);
  return result;
}
