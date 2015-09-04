# JsonApi Compressor

<img align="right" src="http://i.imgur.com/06HNrJK.png">

JsonApi Compressor is a lightweight javascript tool to convert models into JsonApi format. This is intended to only be used on the client side for basic crud operations.

## Installation

```
bower install --save jsonapicompressor
```

## Why JsonApi Compressing?

My motivation for creating a compressor arose when I discovered that models tightly coupled to JsonApi does not work well. Once I began creating a flat model structure with proper prototyping, I needed a way to convert the models back to JsonApi. Example models are given so that the usage of the compressor has some perspective.

## Simple requirements

Models _must_ contain an attribute called `type`.

For update requests, the model _must_ contain an attribute called `id`.

##  Usage
Currently, the serialization only goes one level deep. Making the serialization recursive is a prospective feature. However, I personally have never seen a need to have a relationship within a relationship.

```javascript
  var owner = {
      "type": "person",
      "id": 1,
      "username": "JohnSmith",
      "first-name": "John",
      "last-name": "Smith",
      "password": "DontIncludeThis!",
      "email": "john@example.com"
    }, PERSON_ATTRS = ["username", "first-name", "last-name", "email"],

  maid = {
    "type": "person",
    "id": 2,
    "username": "JaneDoe",
    "first-name": "Jane",
    "last-name": "Doe",
    "email": "jane@example.com"
  }

  myCrib = {
    "type": "House",
    "id": 1,
    "address": "1234 W 5 St.",
    "owner": owner,
    "maid": maid
  }, HOUSE_ATTRS = ["address"],


  result = JSON.stringify(new JsonApiCompressor(myCrib)
    .attributes(HOUSE_ATTRS)
    .relationship('owner').attributes(PERSON_ATTRS).done()
    .relationship('maid').attributes(PERSON_ATTRS).done()
    .output);
```

The result:
```javascript
{
  "data": {
    "id": 1,
    "type": "House",
    "attributes": {
      "address": "1234 W 5 St."
    },
    "relationships": {
      "owner": {
        "data": {
          "type": "person",
          "id": 1
        }
      },
      "maid": {
        "data": {
          "type": "person",
          "id": 2
        }
      }
    }
  },
  "included": [
    {
      "id": 1,
      "type": "person",
      "attributes": {
        "username": "JohnSmith",
        "first-name": "John",
        "last-name": "Smith",
        "email": "john@example.com"
      }
    },
    {
      "id": 2,
      "type": "person",
      "attributes": {
        "username": "JaneDoe",
        "first-name": "Jane",
        "last-name": "Doe",
        "email": "jane@example.com"
      }
    }
  ],
  "links": {}
}
```


## Contribution
Any contributions are welcome, just fork and make a PR. You can contact me at @Jake_Robers.
