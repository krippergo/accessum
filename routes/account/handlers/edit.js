const authentication = (cookies) => require('../../../functions/authentication')(cookies);

module.exports = async (req, res, hash) => {
	const { password, newpassword } = req.body;

	if (!password || !newpassword) {
		res.send({ ok: false, msg: 'Неверный запрос' }).end();
		return;
	}

	const auth = await authentication(req.cookies);

	if (!auth.verified) {
		res.send({ ok: false, msg: 'Ошибка аутентификации' }).end();
		return;
	}

	const accountPassword = auth.data.password;
	const recivedPassword = hash(password);

	if (!accountPassword || accountPassword != recivedPassword) {
		res.send({ ok: false, msg: 'Неверный пароль' }).end();
		return;
	}

	const newAccountPassword = hash(newpassword);
	
	auth.data.password = newAccountPassword;

	await auth.data.save();

	res.send({ ok: true, msg: '' }).end();
};