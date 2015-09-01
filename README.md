# JsonApi Compressor

JsonApi Compressor is a lightweight javascript tool to convert models into JsonApi format. This is intended to only be used on the client side for create, put, and delete methods.

## Requirements

I'm a big fan of underscore. In order to use this tool, underscore must be installed.

```
bower install --save underscore
```

##  Usage

```javascript
  return new JsonApiCompressor(this)
    .attributes(House.prototype.attributes)
    .relation('owner', User)
    .done();
```

Currently, the serialization only goes one level deep. Making the serialization recursive is a prospective feature.

## Example Model

My motivation for creating a compressor arose when I discovered that models tightly coupled to JsonApi does not work well. Once I began creating a flat model structure with proper prototyping, I needed a way to convert the models back to JsonApi. Example models are given so that the usage of the compressor has some perspective.

Models _must_ contain a string with key `type`. For any attribute you want added into the json, include a key for each index in the attribute array. An example User model structure is:

```javascript
User: {
  "attributes": ["username", "first-name", "last-name", "email", "password"],
  "type": "user",
  "username": "myCleverName",
  "first-name": "Jake",
  "email": "example@gmail.com",
}
```

In the above case, password and last-name was not provided. Therefore it will not be included in the serialization.


## Contribution
Any contributions are welcome, just fork and make a PR. You can contact me at @Jake_Robers.
