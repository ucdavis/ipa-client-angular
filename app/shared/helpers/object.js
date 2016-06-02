//Merges properties of 'other' into 'self'
_object_merge = function(self, other) {
	for (var key in other) {
		// hasOwnProperty() allows us to avoid copying prototype properties
		if (other.hasOwnProperty(key)) {
			self[key] = other[key];
		}
	}

	return self;
}

// Empties object without loosing reference
_object_clear = function(self) {
	for (var key in self) {
		// hasOwnProperty() allows us to avoid copying prototype properties
		if (self.hasOwnProperty(key)) {
			delete self[key];
		}
	}

	return self;
}
