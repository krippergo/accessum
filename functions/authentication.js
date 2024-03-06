const { Session } = require('../database/database');
const accountGet = (requipment) => require('./accountGet')(requipment);

module.exports = async (cookies) => {
	if (!cookies) {
		return {
			verified: false
		};
	}

	const sessionToken = cookies['session_token'];
	if (!sessionToken) {
		return {
			verified: false
		};
	}

	let session;
	try {
		session = await Session.findOne({ _id: sessionToken });
		if(!session) {
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

	if (!session.login) {
		return {
			verified: false
		};
	}

	const account = await accountGet({ login: session.login });

	if(!account.verified) {
		return {
			verified: false
		};
	}

	return {
		verified: true,
		data: account.data
	};
};