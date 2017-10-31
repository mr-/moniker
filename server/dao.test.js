import {getMaxId} from "./dao";

const dao = require('./dao');
const _ = require("lodash");

let username = "foobarx";
beforeEach(() => dao.clean());

test('should write and read', (done) => {
    let ranking = [{name: "a", score:0}];
    dao.insertRankings(username, ranking)
        .then(() => dao.readRankings(username))
        .then( (data) => {
        expect(data[0].id).toBe(1);
        expect(data[0].rankings).toEqual(ranking);
        done();
    }
    ).catch((err) => {console.error("failed test..", err); expect(true).toBe(false); done()});
});

test('should write and remove', (done) => {
    let ranking1 = [{name: "a", score:0}];
    let ranking2 = [{name: "b", score:2}];

    dao.insertRankings(username, ranking1)
        .then(() => dao.insertRankings(username, ranking2))
        .then(() => dao.readRankings(username))
        .then( (data) => {
                expect(_.size(data)).toBe(2);
            }
        )
        .then( () => dao.removeRankings(username, 2))
        .then(() => dao.readRankings(username))
        .then( (data) => {
            expect(data[0].id).toBe(1);
            expect(data[0].rankings).toEqual(ranking1);
            done();
        })
        .catch((err) => {console.error("failed test..", err); expect(true).toBe(false); done()});
});

test('get max id of user', (done) => {
    let ranking1 = [{name: "a", score:0}];
    let ranking2 = [{name: "b", score:2}];

    dao.insertRankings(username, ranking1)
        .then( () => dao.getMaxId(username))
        .then( (id) => expect(id).toEqual({"id": 1}))
        .then( () =>dao.insertRankings(username, ranking2))
        .then( () => dao.readRankings(username))
        .then( () => dao.getMaxId(username))
        .then( (id) => { expect(id).toEqual({"id": 2}); done();})
        .catch((err) => {console.error("failed test..", err); expect(true).toBe(false); done()});
});