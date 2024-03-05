const { Account, Session } = require('../../../database/database');

module.exports = async (req, res, hash) => {
	const { login, password, fio, type, username } = req.body;

	if (!login || !password || !fio || !username || !type) {
		res.status(400).end();
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
		res.send('Такой логин уже существует').status(401).end();
		return;
	}

	const hashedPassword = hash(password);

	const newAccount = new Account({
		login: login,
		password: hashedPassword,
		fio: fio,
		type: type,
		username: username
	});

	await newAccount.save();

	const createdAt = new Date();
	const expiresAt = new Date(createdAt.getTime() + (60 * 60 * 24 * 1000));

	const session = new Session({
		login: login,
		createdAt: createdAt,
		expiresAt: expiresAt
	});

	await session.save();

	res.cookie('session_token', session.id, { expires: expiresAt, httpOnly: true, use_only_cookies: true }).status(200).end();
};