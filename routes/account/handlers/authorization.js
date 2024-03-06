const { Session } = require('../../../database/database');
const accountGet = (requipment) => require('../../../functions/accountGet')(requipment);

module.exports = async (req, res, hash) => {
	const { login, password } = req.body;
	
	if (!login || !password) {
		res.send({ ok: false, msg: 'Неверный запрос' }).end();
		return;
	}

	const account = await accountGet({ login: login });
	if(!account.verified) {
		res.send({ ok: false, msg: 'Неверный логин или пароль' }).end();
		return;
	}

	const accountPassword = account.data.password;
	const recivedPassword = hash(password);

	if (!accountPassword || accountPassword != recivedPassword) {
		res.send({ ok: false, msg: 'Неверный логин или пароль' }).end();
		return;
	}

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