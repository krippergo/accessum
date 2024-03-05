module.exports = (mongoose) => {
	const sessionSchema = new mongoose.Schema({
		login: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			required: true
		},
		expiresAt: {
			type: Date,
			required: true
		}
	});

	return mongoose.model('session', sessionSchema);
};