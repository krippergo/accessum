const { Checkpoint } = require('../../../database/database');
const authentication = (cookies) => require('../../../functions/authentication')(cookies);
const points = (account) => require('../../../functions/pointsGet')(account);

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

	const poin = await points(auth.data);

	if (!poin.verified) {
		res.send({ ok: false, msg: 'Ошибка сервера' }).end();
		return;
	}

	const available = [];

	poin.data.owner.forEach((item) => {
		available.push(item.id);
	});

	poin.data.available.forEach((item) => {
		available.push(item.id);
	});

	let checkpoint;
	try {
		checkpoint = await Checkpoint.findOne({ _id: id });
		if(!checkpoint) {
			res.send({ ok: false, msg: 'Ошибка доступа' }).end();
			return;
		}
	}
	catch(error) {
		console.log(error);
		res.send({ ok: false, msg: 'Ошибка доступа' }).end();
		return;
	}
	
	if(!available.includes(String(checkpoint.point_id))) {
		res.send({ ok: false, msg: 'Ошибка доступа' }).end();
		return;
	}

	try {
		await Checkpoint.deleteOne({ _id: id });
	}
	catch(error) {
		console.log(error);
		res.send({ ok: false, msg: 'Ошибка сервера' }).end();
		return;
	}

	res.send({ ok: true, msg: '' }).end();
};