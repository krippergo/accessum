const authentication = (cookies) => require('../../../functions/authentication')(cookies);

module.exports = async (req, res) => {
	const auth = await authentication(req.cookies);

	if (!auth.verified) {
		res.send({ ok: false, msg: 'Ошибка аутентификации' }).end();
		return;
	}

	auth.data.opened = !auth.data.opened;

	await auth.data.save();

	res.send({ ok: true, msg: '' }).end();
};