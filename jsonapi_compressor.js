var JsonApiCompressorBase = function() {

};

JsonApiCompressorBase.prototype = {
	attributes: function(attributes) {
		if ( !attributes ) {
			return new Error("attributes is not defined");
		}
		if ( _.isObject(this.object) ) {
			this.json.data = _.extend({type: this.object.type}, _.pick(this.object, ["id"]));
			this.json.data.attributes = _.pick(this.object, attributes);
		} else {
			return new Error("Data given in constructor is not an object");
		}
		return this;
	},
	relation: function(relName, relObj) {
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
		return this;
	},
	done: function() {
		return this.json;
	}
};

var JsonApiCompressor = function JsonApiCompressor(object) {
	this.object = object;
	this.json = {
		data: {},
		included: [],
		links: {}
	};
	return this;
};
JsonApiCompressor.prototype = Object.create(JsonApiCompressorBase.prototype);

