const { Point } = require('../../../database/database');
const authentication = (cookies) => require('../../../functions/authentication')(cookies);

module.exports = async (req, res) => {
	const { name } = req.body;

	if (!name) {
		res.send({ ok: false, msg: 'Неверный запрос' }).end();
		return;
	}

	const auth = await authentication(req.cookies);

	if (!auth.verified) {
		res.send({ ok: false, msg: 'Ошибка аутентификации' }).end();
		return;
	}

	const point = new Point({
		name: name,
		account_id: auth.data.id
	});

	await point.save();

	res.send({ ok: true, msg: '' }).end();
};