var BaseModel = function() {

};

BaseModel.prototype = {
	attributes: [],
	type: null,
}


var User = function(params) {

};

User.prototype = Object.create(BaseModel.prototype);
User.prototype = _.extend(BaseModel.prototype, {
	attributes: ["username", "first-name", "last-name", "email", "password"],
	endpoint: function() {
		return "/users";
	},
	type: "user",
	init: User,
	compress: function() {
		//here is the usage of JsonApiCompressor
		return new JsonApiCompressor(this).attributes(User.prototype.attributes).done();
	}
});



var House = function(params) {
	var self = this;
	//do initialization of params here on self.
};

House.prototype = Object.create(BaseModel.prototype);
House.prototype = _.extend(BaseModel.prototype, {
	attributes: ["address", "city", "state", "zip"],
	endpoint: function() {
		return "/properties";
	},
	type: "house",
	init: House,
	compress: function() {
		//here is the usage of JsonApiCompressor
		return new JsonApiCompressor(this)
			.attributes(House.prototype.attributes)
			.relation('owner', User)
			.done();
	}
});

