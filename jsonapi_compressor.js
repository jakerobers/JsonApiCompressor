var _ = require("underscore"),
	q = require("q");

var JsonApiCompressor = function JsonApiCompressor(object, parent) {
	if ( !_.isObject(object) ) {
		return new Error("Object was not passed into JsonApiCompressor.")
	}
	this.object = object;
	this.parent = parent;

	this.json = {
		data: {},
		included: [],
		links: {}
	};
};

JsonApiCompressor.prototype.attributes = function(attributes) {
	if ( !attributes ) {
		return new Error("The attributes for an object is undefined.");
	} else if ( !_.isArray(attributes) ) {
		return new Error("Attributes must be an array.")
	}
	if ( !this.object.type ) {
		return new Error("The type for an object is undefined.")
	} else if ( !_.isString(this.object.type) ) {
		return new Error("The type for an object must be a string.");
	}
	if ( !this.object.id ) {
		return new Error("The id for an object is undefined.")
	}


	this.json.data = {"id": this.object.id, "type": this.object.type}
	this.json.data.attributes = _.pick(this.object, attributes);
	return this;
};

JsonApiCompressor.prototype.relationship = function(relName) {
	if ( this.object[relName] ) {
		if ( !this.json.data.relationships ) {
			this.json.data.relationships = {};
		}

		var relObj = this.object[relName];
		if ( !this.json.data.relationships[relName] ) {
			if ( _.isObject(relObj) ) {
				if ( relObj.id && relObj.type ) {
					this.json.data.relationships[relName] = {id: relObj.id, type: relObj.type};
				} else {
					return new Error("Relationship object must have id and type.")
				}
			} else if ( _.isArray(relObj) ) {
				for ( var i = 0, node; node = relObj[i]; i++ ) {
					if ( _.isObject(node) ) {
						if ( node.id && node.type ) {
							if ( this.json.data.relationships[relName].data && _.isObject(this.json.data.relationships[relName].data) ) {
								this.json.data.relationships[relName].data = [this.json.data.relationships[relName].data];
								this.json.data.relationships[relName].data.push(node);
							} else if ( this.json.data.relationships[relName].data && _.isArray(this.json.data.relationships[relName].data) ) {
								this.json.data.relationships[relName].data.push(node);
							} else {
								if ( !this.json.data.relationships[relName] ) {
									this.json.data.relationships[relName] = {};
								}
								this.json.data.relationships[relName].data = {id: node.id, type: node.type};
							}
						} else {
							return new Error("Relationship array index must have id and type.")
						}
					} else {
						return new Error("Relationship array index must be an object");
					}
				}
			} else {
				return new Error("Relationship object must be an object or array.");
			}
			this.json.data.relationships[relName] = _.pick(relObj, ["id", "type"]);
		} else if ( _.isObject(this.json.data.relationships[relName]) ) {
			this.json.data.relationships[relName] = [this.json.data.relationships[relName]];
			this.json.data.relationships[relName].push(_.extend({type: relObj.type}, _.pick(this.object[relName], "id")));
		} else if ( !_.isArray(this.json.data.relationships[relName]) ) {
			console.error("JsonApiCompressor could not compress " + relName + ". Check format.");
		}
	}
	var a = new JsonApiCompressor(relObj, this);
	console.log(a);
	return a;

};

JsonApiCompressor.prototype.done = function() {
	if ( !this.parent ) {
		return new Error("Already at root object.");
	} else {
		this.parent.json.included.push(this.json.data);
		for ( var i = 0, parent; parent = this.parent.json.included[i]; i++ ) {
			for ( var k = 0, child; child = this.json.included[k]; i++ ) {
				if ( child.id === parent.id && child.type === parent.type ) {
					continue;
				}
				this.parent.json.included.push(child);
			}
		}
		this.parent.included.concat(this.json.included);
	}
	return this.parent;
};