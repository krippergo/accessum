const { Account, Session } = require('../../../database/database');

module.exports = async (req, res, hash) => {
	const { password, newpassword } = req.body;

	if (!password || !newpassword) {
		res.status(400).end();
		return;
	}

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

	const accountPassword = account.password;
	const recivedPassword = hash(password);

	console.log(accountPassword, recivedPassword);

	if (!accountPassword || accountPassword != recivedPassword) {
		res.send('Неверный логин или пароль').status(401).end();
		return;
	}

	const newAccountPassword = hash(newpassword);
	
	account.password = newAccountPassword;

	await account.save();

	res.status(200).end();
};