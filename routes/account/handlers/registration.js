const { Account, Session } = require('../../../database/database');
const accountGet = (requipment) => require('../../../functions/accountGet')(requipment);

module.exports = async (req, res, hash) => {
	const { login, password, fio, type, username } = req.body;

	if (!login || !password || !fio || !username || !type) {
		res.send({ ok: false, msg: 'Неверный запрос' }).end();
		return;
	}

	const account = await accountGet({ login: login });
	if(account.verified) {
		res.send({ ok: false, msg: 'Такой логин уже существует' }).end();
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

	res.cookie('session_token', session.id, { expires: expiresAt, httpOnly: true, use_only_cookies: true }).send({ ok: true, msg: '' }).end();
};