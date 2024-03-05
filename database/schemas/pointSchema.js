module.exports = (mongoose) => {
	const pointSchema = new mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		account_id: {
			type: mongoose.ObjectId,
			ref: 'account'
		}
	},
	{
		timestamps: true
	});
	
	return mongoose.model('point', pointSchema);
};