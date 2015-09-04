
describe("attributes", function() {
  it("should error if none are given", function() {
    chai.assert.throw(function() {
      new JsonApiCompressor.bind(null);
    }, Error);
  });

  it("should error if it is not an object", function() {
    chai.assert.throw(function() {
      new JsonApiCompressor.bind([]);
    }, Error);

  });

  it("should properly convert 0 levels deep not including all attributes", function() {
    var Person = {
      attributes: ["username", "email", "password"]
    }
    var result = new JsonApiCompressor({
      "id":1,
      "type": "user",
      "attributes": ["username", "email", "password"],
      "email": "example@gmail.com",
      "username":" example"
    }).attributes(Person.attributes).json;
  });

  it("should properly convert 0 levels deep including all attributes", function() {
    var Person = {
      attributes: ["username", "email", "password"]
    }
    var result = new JsonApiCompressor({
      "id":1,
      "type": "user",
      "attributes": ["username", "email", "password"],
      "email": "example@gmail.com",
      "username":" example",
      "password": "abc123"
    }).attributes(Person.attributes).json;
  });

  it("should properly convert 1 level deep", function() {
  });
});

describe("relationships", function() {
  it("shoud error if an incorrect relationship is given", function() {

  });

  it("should properly convert an array 0 level deep", function() {

  });

  it("should properly convert an object 0 level deep", function() {

  });

  it("should properly convert an array 1 level deep", function() {
    var Person = {
      attributes: ["first-name", "last-name"]
    },
    Business = {
      attributes: ["address", "city", "state", "name"]
    },
    result = JSON.stringify(new JsonApiCompressor({
      "id": "1",
      "type": "business",
      "attributes": ["address", "city", "state", "name"],
      "name": "Dunder Mifflin",
      "address": "1725 Slough Avenue",
      "city": "Scranton",
      "state": "PA",
      "employees": [{
        "id": "1",
        "type": "person",
        "attributes": ["first-name", "last-name"],
        "first-name": "Dwight",
        "last-name": "Schrute"
      }, {
        "id": "2",
        "type": "person",
        "attributes": ["first-name", "last-name"],
        "first-name": "Phyllis",
        "last-name": "Smith"
      }],
      "manager": {
        "id": "3",
        "type": "person",
        "attributes": ["first-name", "last-name"],
        "first-name": "Michael",
        "last-name": "Scott"
      }
    }).attributes(Business.attributes)
      .relationship("employees").attributes(Person.attributes).done()
      .relationship("manager").attributes(Person.attributes).done()
      .output),

    expected = '{"data":{"id":"1","type":"business","attributes":{"address":"1725 Slough Avenue","city":"Scranton","state":"PA","name":"Dunder Mifflin"},"relationships":{"employees":{"data":[{"type":"person","id":"1"},{"type":"person","id":"2"}]},"manager":{"data":{"type":"person","id":"3"}}}},"included":[{"id":"1","type":"person","attributes":{"first-name":"Dwight","last-name":"Schrute"}},{"id":"2","type":"person","attributes":{"first-name":"Phyllis","last-name":"Smith"}},{"id":"3","type":"person","attributes":{"first-name":"Michael","last-name":"Scott"}}],"links":{}}';
    chai.assert.equal(result, expected);
  });

  it("should properly convert an object 2 levels deep", function() {

  });
});
