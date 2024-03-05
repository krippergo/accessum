module.exports = (mongoose) => {
	const accountSchema = new mongoose.Schema({
		login: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		fio: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true,
		},
		opened: {
			type: Boolean,
			default: true
		},
		accounts_access: {
			type: [String],
			default: []
		}
	});

	return mongoose.model('account', accountSchema);
};