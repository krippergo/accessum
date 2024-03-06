const { Point } = require('../../../database/database');
const authentication = (cookies) => require('../../../functions/authentication')(cookies);

module.exports = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		res.send({ ok: false, msg: 'Неверный запрос' }).end();
		return;
	}

	const auth = await authentication(req.cookies);

	if (!auth.verified) {
		res.send({ ok: false, msg: 'Ошибка аутентификации' }).end();
		return;
	}

	try {
		await Point.deleteOne({ _id: id, account_id: auth.data.id });
	}
	catch(error) {
		console.log(error);
		res.send({ ok: false, msg: 'Ошибка сервера' }).end();
		return;
	}

	res.send({ ok: true, msg: '' }).end();
};