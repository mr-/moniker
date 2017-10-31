/* @flow */

const fs = require("fs");
const _ = require("lodash");
const glob = require('glob-fs')({ gitignore: true });

import {getMaxId, readRankings, insertRankings, removeRankings} from "./dao"
import type {Rank, Rankings} from "./Types"


const names = getAvailableNames();

console.log("Starting with so many names:", _.size(names));


export function undo(username : string) {
    return getMaxId(username).then( (id) => id && removeRankings(username, id.id));
}


export function writeScore(username : string, scoring : Rankings) {
    return insertRankings(username, scoring);
}

export function getNames(username : string) {
  return readRankings(username)
  .then( getResult );
}


export function accumulateRanking(rankings: Array<{id: number, rankings: Rankings}>) {
    let result = {};
    const names = _.flatten(_.map(rankings, (x) => x.rankings));

    names.forEach((x) => {
        if (!_.isUndefined(result[x.name])) {
            result[x.name] = result[x.name] + x.score;
        } else {
            result[x.name] = x.score;
        }
    });

    const ranking = _.map(result, (v, k) => {return {name: k, score: v}});

    return _.reverse(_.sortBy(ranking, x => x.score))
}

export function getCurrentPick(rankings: Array<{id: number, rankings: Rankings}>) {
    if (_.size(rankings) == 0) {
        return undefined;
    }
    return _.find(rankings[0].rankings, (r) => r.score === 1 );

}

function getResult(rankings: Array<{id: number, rankings: Rankings}>) {
    const currentRanking = accumulateRanking(rankings);
    const currentPick = getCurrentPick(rankings);

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
       if (currentPick) {
           add = _.uniq([currentPick.name, used[0]]);
       } else {
           add = _.uniq([used[0]]);
       }
       result.selection = _.shuffle(_.sampleSize(toDo, 5 - _.size(add)).concat(add))
    } else {
       result.selection = _.sampleSize(toDo, 5)
    }

    console.log("ranking", ranking);

    result.ranking = _.take(ranking, 50);
    result.currentPick = currentPick;
    return result;
}

function readFile(filename) {
    return _.filter(_.map(fs.readFileSync(filename, 'utf8').split("\n"), x => _.trim(x)),
        name => name !== '' && !name.includes('-'));
}

function getAvailableNames() {
    const files = glob.readdirSync('names/*.txt');
    console.log("using files ", files);
    return _.uniq(_.flatten(_.map(files, file => readFile(file))));
}