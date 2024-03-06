const authentication = (cookies) => require('../../../functions/authentication')(cookies);
const points = (account) => require('../../../functions/pointsGet')(account);

module.exports = async (req, res) => {
	const auth = await authentication(req.cookies);

	if (!auth.verified) {
		res.send({ ok: false, msg: 'Ошибка аутентификации' }).end();
		return;
	}

	const poin = await points(auth.data);

	if (!poin.verified) {
		res.send({ ok: false, msg: 'Ошибка сервера' }).end();
		return;
	}

	if(poin.data.owner.length == 0 && poin.data.available.length == 0) {
		res.send({ ok: false, msg: 'Список пуст' }).end();
		return;
	}

	res.send({ ok: true, msg: poin.data }).end();
};