var _ = require("underscore"),
	q = require("q"),
	JsonApiCompressor = function JsonApiCompressor(object, parent) {
	if ( !_.isObject(object) ) {
		return new Error("Object was not passed into JsonApiCompressor.")
	}
	this.object = object;
	this.parent = parent;

	this.attributes = function() {
		if ( !this.object.attributes ) {
			return new Error("The object provided does not have attributes.");
		} else if ( !_.isArray(this.object.attributes) ) {
			return new Error("Attributes must be an array.")
		}
		this.json.data = _.extend({type: this.object.type}, _.pick(this.object, ["id"]));
		this.json.data.attributes = _.pick(this.object, this.object.attributes);
		return this;
	};

	this.relationships = function(relName, relObj) {
		if ( this.object[relName] && relObj ) {
			if ( !this.json.data.relationships ) {
				this.json.data.relationships = {};
			}

			if ( !this.json.data.relationships[relName] ) {
				this.json.data.relationships[relName] = _.extend({type: relObj.prototype.type}, _.pick(this.object[relName], "id"));
			} else if ( _.isObject(this.json.data.relationships[relName]) ) {
				this.json.data.relationships[relName] = [this.json.data.relationships[relName]];
				this.json.data.relationships[relName].push(_.extend({type: relObj.prototype.type}, _.pick(this.object[relName], "id")));
			} else if ( !_.isArray(this.json.data.relationships[relName]) ) {
				console.error("JsonApiCompressor could not compress " + relName + ". Check format.");
			}
		}
		return new JsonApiCompressor(relObj, this);
	};

	this.done = function() {
		if ( !this.parent ) {
			return new Error("Already at root object.");
		}
		return this.parent;
	}

	this.json = {
		data: {},
		included: [],
		links: {}
	};
	return this;
};
