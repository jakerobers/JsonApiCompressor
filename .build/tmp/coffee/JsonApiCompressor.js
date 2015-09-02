(function() {
  var JsonApiCompressorBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  JsonApiCompressorBase = (function() {
    JsonApiCompressorBase.prototype.parent = null;

    JsonApiCompressorBase.prototype.object = null;

    JsonApiCompressorBase.prototype.output = null;

    function JsonApiCompressorBase(object, parent) {
      if (!_.isObject(object)) {
        return new Error("Object was not passed into JsonApiCompressor.");
      }
      if (!(object.type || _.isString(object.type))) {
        return new Error("The type for an object must be defined as a string.");
      }
      if (!object.id) {
        return new Error("The id for an object is undefined.");
      }
      this.object = object;
      this.parent = parent;
      this.output = {
        data: {},
        included: {},
        links: {}
      };
    }

    JsonApiCompressorBase.prototype.attributes = function(attributes) {
      if (!attributes) {
        return new Error("The attributes for an object is undefined.");
      } else if (!_.isArray(attributes)) {
        return new Error("The attributes for an object is undefined.");
      }
      this.output.data = {
        "id": this.object.id,
        "type": this.object.type
      };
      this.output.data.attributes = _.pick(this.object, attributes);
      return this;
    };

    JsonApiCompressorBase.prototype.relationship = function(relName) {
      var relObj, relToBeAdded;
      if (!relName) {
        return new Error("relationship must be given a parameter.");
      }
      relObj = this.object.relName;
      if (!relObj) {
        return new Error("Relationship object is not defined.");
      } else if (!relObj.type) {
        return new Error("Relationship object type is not defined.");
      }

      /* Set the defaults */
      if (!this.output.data.relationships) {
        this.output.data.relationships = {};
      }
      if (!this.output.data.relationships[relName]) {
        this.output.data.relationships[relName] = {};
      }
      if (!this.output.data.relationships[relName].data) {
        this.output.data.relationships[relName].data = {};
      }
      relToBeAdded = {
        type: relObj.type
      };
      if (relObj.id != null) {
        relToBeAdded.id = relObj.id;
      }
      if (_.isEmpty(this.output.data.relationships[relName].data)) {
        this.output.data.relationships[relName].data = relToBeAdded;
      } else if (_.isObject(this.output.data.relationships[relName].data)) {
        this.output.data.relationships[relName].data = [this.output.data.relationships[relName].data];
        this.output.data.relationships[relName].data.push(relToBeAdded);
      } else if (_.isArray(this.output.data.relationships[relName].data)) {
        this.output.data.relationships[relName].data.push(relToBeAdded);
      } else {
        return new Error("object." + relName + ".data must be an array or object.");
      }
      return new JsonApiConpressorBase(this.object[relName], this);
    };

    JsonApiCompressorBase.prototype.done = function() {};

    return JsonApiCompressorBase;

  })();

  this.JsonApiCompressor = (function(superClass) {
    extend(JsonApiCompressor, superClass);

    function JsonApiCompressor(object) {
      console.log(object);
    }

    return JsonApiCompressor;

  })(JsonApiCompressorBase);

}).call(this);
