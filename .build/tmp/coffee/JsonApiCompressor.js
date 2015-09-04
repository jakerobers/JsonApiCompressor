(function() {
  var JsonApiCompressorBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  JsonApiCompressorBase = (function() {
    JsonApiCompressorBase.prototype.parent = null;

    JsonApiCompressorBase.prototype.object = null;

    JsonApiCompressorBase.prototype.output = null;

    function JsonApiCompressorBase(object, parent) {
      if (!(_.isObject(object) || _.isArray(object))) {
        throw new Error("Object was not passed into JsonApiCompressor.");
      }
      if (!((object.type || _.isString(object.type)) || (object[0].type && _.isString(object[0].type)))) {
        throw new Error("The type for an object must be defined as a string.");
      }
      if (!(object.id || object[0].id)) {
        throw new Error("The id for an object is undefined.");
      }
      this.object = object;
      this.parent = parent;
      this.output = {
        data: {},
        included: [],
        links: {}
      };
    }

    JsonApiCompressorBase.prototype.attributes = function(attributes) {
      var data, i, len, node, ref;
      if (!attributes) {
        throw new Error("The attributes for an object is undefined.");
      } else if (!_.isArray(attributes)) {
        throw new Error("The attributes for an object must be a list.");
      }
      if (_.isObject(this.object) && !_.isArray(this.object) && !_.isFunction(this.object)) {
        this.output.data = {
          "id": this.object.id,
          "type": this.object.type
        };
        this.output.data.attributes = _.pick(this.object, attributes);
      } else if (_.isArray(this.object)) {
        this.output.data = [];
        ref = this.object;
        for (i = 0, len = ref.length; i < len; i++) {
          node = ref[i];
          data = {
            "id": node.id,
            "type": node.type
          };
          data.attributes = _.pick(node, attributes);
          this.output.data.push(data);
        }
      } else {
        throw new Error("The given object must be an object or array.");
      }
      return this;
    };

    JsonApiCompressorBase.prototype.relationship = function(relName) {
      var i, len, relNode, relObj, relToBeAdded;
      if (!relName) {
        throw new Error("relationship must be given a parameter.");
      }
      relObj = this.object[relName];
      if (!relObj) {
        throw new Error("Relationship object is not defined.");
      }
      if (!_.isObject(relObj) || (_.isArray(relObj) && _.isEmpty(relObj))) {
        throw new Error("Relationship object must be an object, or an array with at least one index.");
      }
      if (!(relObj.type || (_.isArray(relObj) && relObj[0].type))) {
        throw new Error("Relationship object type is not defined.");
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
      if (!_.isArray(relObj)) {
        relObj = [relObj];
      }
      for (i = 0, len = relObj.length; i < len; i++) {
        relNode = relObj[i];
        relToBeAdded = {
          type: relNode.type
        };
        if (relNode.id != null) {
          relToBeAdded.id = relNode.id;
        }
        if (_.isEmpty(this.output.data.relationships[relName].data)) {
          this.output.data.relationships[relName].data = relToBeAdded;
        } else if (_.isObject(this.output.data.relationships[relName].data) && !_.isArray(this.output.data.relationships[relName].data) && !_.isFunction(this.output.data.relationships[relName].data)) {
          this.output.data.relationships[relName].data = [this.output.data.relationships[relName].data];
          this.output.data.relationships[relName].data.push(relToBeAdded);
        } else if (_.isArray(this.output.data.relationships[relName].data)) {
          this.output.data.relationships[relName].data.push(relToBeAdded);
        } else {
          throw new Error("object." + relName + ".data must be an array or object.");
        }
      }
      return new JsonApiCompressorBase(this.object[relName], this);
    };

    JsonApiCompressorBase.prototype.done = function() {
      var i, len, node, ref;
      if (!_.isObject(this.output.data) || _.isFunction(this.output.data)) {
        throw new Error("Output data did not convert properly: " + this.output.data);
      }

      /* Load into included */
      if (_.isArray(this.output.data)) {
        ref = this.output.data;
        for (i = 0, len = ref.length; i < len; i++) {
          node = ref[i];
          this.parent.output.included.push(node);
        }
      } else {
        this.parent.output.included.push(this.output.data);
      }
      return this.parent;
    };

    return JsonApiCompressorBase;

  })();

  this.JsonApiCompressor = (function(superClass) {
    extend(JsonApiCompressor, superClass);

    function JsonApiCompressor(object) {
      JsonApiCompressor.__super__.constructor.call(this, object);
    }

    return JsonApiCompressor;

  })(JsonApiCompressorBase);

}).call(this);
