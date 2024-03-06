const { Account } = require('../database/database');

module.exports = async (requirement) => {
	let account;
	try {
		account = await Account.findOne(requirement);
		if(!account) {
			return {
				verified: false
			};
		}
	}
	catch(error) {
		console.log(error);
		return {
			verified: false
		};
	}

	return {
		verified: true,
		data: account
	};
};