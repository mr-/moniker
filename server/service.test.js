const service = require('./service');
const dao = require('./dao');

const username = "foo";
beforeEach(() => dao.clean());
test('should write and get', (done) => {
    const toWrite = [
        {name: "Stanislaus", score:0 },
        {name: "Benedick", score:0 },
        {name: "Gottwert", score:0 },
        {name: "Gerwas", score:0 },
        {name: "Woldemar", score:1 }];
    const expected = [{"name": "Woldemar", "score": 1}, {"name": "Gerwas", "score": 0}, {"name": "Gottwert", "score": 0}, {"name": "Benedick", "score": 0}, {"name": "Stanislaus", "score": 0}];

    service.writeScore(username, toWrite)
        .then(() => service.getNames( username ))
        .then(
          (data) => {
            expect(data.currentPick).toEqual({"name": "Woldemar"});
              expect(data.ranking).toEqual(expected);
            done();
          }
      ).catch(done);
});
