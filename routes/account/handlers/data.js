const { Account, Session } = require('../../../database/database');

module.exports = async (req, res) => {
	if (!req.cookies) {
		res.status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.status(401).end();
		return;
	}

	let session;
	try {
		session = await Session.findOne({ _id: sessionToken });
		if(!session) {
			res.status(401).end();
			return;
		}
	}
	catch(error) {
		console.log(error);
		res.status(401).end();
		return;
	}

	if (!session.login) {
		res.status(401).end();
		return;
	}

	let account;
	try {
		account = await Account.findOne({ login: session.login });
		if(!account) {
			res.status(401).end();
			return;
		}
	}
	catch(error) {
		console.log(error);
		res.status(401).end();
		return;
	}

	account.password = '';

	res.send(account).status(200).end();
};