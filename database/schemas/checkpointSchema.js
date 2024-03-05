module.exports = (mongoose) => {
	const checkpointSchema = new mongoose.Schema({
		qr_url: {
			type: String
		},
		point_id: {
			type: mongoose.ObjectId,
			ref: 'point'
		}
	},
	{
		timestamps: true
	});
	
	return mongoose.model('checkpoint', checkpointSchema);
};