const QRCode = require('qrcode');
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

	const checkpoint = new Checkpoint({
		qr_url: '',
		point_id: id
	});

	// const url = req.protocol + '://' + req.get('host') + '/' + checkpoint.id + '/';
	const url = `http://localhost:5173/open/${ checkpoint.id }/`;

	checkpoint.qr_url = await QRCode.toDataURL(url);

	await checkpoint.save();

	res.send({ ok: true, msg: '' }).end();
};