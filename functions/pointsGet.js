const { Account, Point } = require('../database/database');

module.exports = async (account) => {
	let response = {
		owner: [],
		available: []
	};

	let ownerPoints;
	try {
		ownerPoints = await Point.find({ account_id: account.id }).sort({ updatedAt: -1 });
		if(!ownerPoints) {
			response.owner = [];
		}
	}
	catch(error) {
		console.log(error);
		return {
			verified: false
		};
	}

	response.owner = ownerPoints;

	let account_ids = [];

	let accounts;
	try {
		accounts = await Account.find({ login: { $in: account.accounts_access } });
		if(!accounts) {
			response.available = [];
		} else {
			accounts.forEach((item) => {
				account_ids.push(item.id);
			});
	
			let availablePoints;
			try {
				availablePoints = await Point.find({ account_id: { $in: account_ids } }).sort({ updatedAt: -1 });
				if(!availablePoints) {
					return {
						verified: false
					};
				}
		
				availablePoints.forEach((item) => {
					response.available.push(item);
				});
			}
			catch(error) {
				console.log(error);
				return {
					verified: false
				};
			}
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
		data: response
	};
};