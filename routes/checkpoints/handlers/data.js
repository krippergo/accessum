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

	if(!available.includes(id)) {
		res.send({ ok: false, msg: 'Ошибка доступа' }).end();
		return;
	}

	let checkpoints;
	try {
		checkpoints = await Checkpoint.find({ point_id: id }).sort({ updatedAt: -1 }).populate('point_id');
		if(!checkpoints) {
			res.send({ ok: false, msg: 'Ошибка сервера' }).end();
			return;
		}
	}
	catch(error) {
		console.log(error);
		res.send({ ok: false, msg: 'Ошибка сервера' }).end();
		return;
	}
	
	if(checkpoints.length == 0) {
		res.send({ ok: false, msg: 'Список пуст' }).end();
		return;
	}

	res.send({ ok: true, msg: checkpoints }).end();
};