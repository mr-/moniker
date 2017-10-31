const service = require('./service');
const dao = require('./dao');

const username = "foo";
beforeEach(() => dao.clean());
test('should write and get', (done) => {
    const toWrite = [
        { name: "Stanislaus", score:0 },
        { name: "Benedick",   score:0 },
        { name: "Gottwert",   score:0 },
        { name: "Gerwas",     score:0 },
        { name: "Woldemar",   score:1 }
        ];
    const expected = [{"name": "Woldemar", "score": 1}, {"name": "Stanislaus", "score": 0}, {"name": "Benedick", "score": 0}, {"name": "Gottwert", "score": 0}, {"name": "Gerwas", "score": 0}];
    service.writeScore(username, toWrite)
        .then(() => service.getNames( username ))
        .then(
          (data) => {
              console.log("got data", data);
              expect(data.currentPick).toEqual({"name": "Woldemar", "score": 1});
              expect(data.ranking).toEqual(expected);
            done();
          }
      ).catch(done);
});


test('should write and undo and get', (done) => {
    const toWrite = [
        { name: "Stanislaus", score:0 },
        { name: "Benedick", score:0 },
        { name: "Gottwert", score:0 },
        { name: "Gerwas", score:0 },
        { name: "Woldemar", score:1 }
    ];
    const toWrite2 = [
        { name: "1", score:0 },
        { name: "2", score:0 },
        { name: "3", score:0 },
        { name: "4", score:1 },
        { name: "Woldemar", score:0 }
    ];
    const expected = [
        {"name": "Woldemar", "score": 1},
        {"name": "Stanislaus", "score": 0},
        {"name": "Benedick", "score": 0},
        {"name": "Gottwert", "score": 0},
        {"name": "Gerwas", "score": 0}
    ];

    service.writeScore(username, toWrite)
        .then(() => service.getNames( username ))
        .then(
            (data) => {
                expect(data.currentPick).toEqual({"name": "Woldemar", "score": 1});
                expect(data.ranking).toEqual(expected);
                done();
            }
        )
        .then(() => service.writeScore(username, toWrite2) )
        .then(() => service.undo(username))
        .then(() => service.getNames( username ))
        .then(
            (data) => {
                console.log("undone");
                expect(data.currentPick).toEqual({"name": "Woldemar"});
                expect(data.ranking).toEqual(expected);
                done();
            }
        )
        .catch((err) => {
            console.log("error..", err);
            expect(true).toBe(false);
            done()
        });
});

test("should accumulate ranking", () => {
    const rankings = [
        {id: 1, rankings:  [{name: "2", score: 1}, {name: "1", score: 1}]},
        {id: 2, rankings: [{name: "2", score: 1}]}
        ];
    const res = service.accumulateRanking(rankings);
    expect(res).toEqual([{name: "2", score: 2},{name: "1", score: 1}]);
});

test("should find pick of current ranking", () => {
    const ranking = [{id: 1, rankings:  [{name: "2", score: 0}, {name: "1", score: 1}]}];
    const res = service.getCurrentPick(ranking);
    expect(res).toEqual( {"name": "1", "score": 1});
});
