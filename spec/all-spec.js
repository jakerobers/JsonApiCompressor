fs = require('fs')
eval(fs.readFileSync('../.build/app/app.js','utf-8'))

describe("attributes", function() {
  it("should error if none are given", function() {
    var result = new JsonApiCompressor(null);
  });

  it("should error if it is not an object", function() {
    var result = new JsonApiCompressor([]);
  });

  it("should properly convert 0 levels deep not including all attributes", function() {
    var result = new JsonApiCompressor({
      "id":1,
      "type": "user",
      "attributes": ["username", "email", "password"],
      "email": "example@gmail.com",
      "username":" example"
    }).attributes().json;
  });

  it("should properly convert 0 levels deep including all attributes", function() {
    var result = new JsonApiCompressor({
      "id":1,
      "type": "user",
      "attributes": ["username", "email", "password"],
      "email": "example@gmail.com",
      "username":" example",
      "password": "abc123"
    }).attributes().json;
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
    result = new JsonApiCompressor({
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
      .relationship("employees")
      .attributes(Person.attributes)
      .done()
      .json,

    expected = {
      "data": {
        "id": "1",
        "type": "business",
        "attributes": {
          "name": "Dunder Mifflin",
          "address": "1725 Slough Avenue",
          "city": "Scranton",
          "state": "PA"
        },
        "relationships": {
          "employee": [
            {"id": "1","type": "person"},
            {"id": "2", "type":"person"}
          ],
          "manager": {"id": "3", "type": "person"}
        }
      },
      "included": [{
        "id": "1",
        "type": "person",
        "attributes": {
          "first-name": "Dwight",
          "last-name": "Schrute"
        }
      }, {
        "id": "2",
        "type": "person",
        "attributes": {
          "first-name": "Phyllis",
          "last-name": "Smith"
        }
      }, {
        "id": "3",
        "type": "person",
        "attributes": {
          "first-name": "Michael",
          "last-name": "Scott"
        }
      }]
    };
    expect(result).toBe(expected);
  });

  it("should properly convert an object 2 levels deep", function() {

  });
});
