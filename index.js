const express = require('express'), app = express(), router = express.Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createHmac } = require('node:crypto');
const QRCode = require('qrcode');

const secret = 'z4g33r';
const port = 3005;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser(secret));
app.use(express.json());
app.use(router);

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});

const hash = (password) => {
	const hashed = createHmac('sha256', secret)
				.update(password)
				.digest('hex');
	
	return hashed;
}

require('./routes/routes')(router, hash);

const { Account, Session, Point, Checkpoint } = require('./database/database');

app.post('/points/add', async function (req, res) {
	const { name } = req.body;

	if (!name) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if(!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const newPoint = new Point({
		name: name,
		account_id: account.id
	});

	await newPoint.save();

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/points/get', async function(req, res) {
	if (!req.cookies) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if (!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	let response = {
		owner: [],
		available: []
	};

	const ownerPoints = await Point.find({ account_id: account.id }).sort({ updatedAt: -1 });
	if(!ownerPoints) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	response.owner = ownerPoints;

	let account_ids = [];

	const accounts = await Account.find({ login: { $in: account.accounts_access } });
	if(!accounts) {
		response.available = [];
	} else {
		accounts.forEach((item) => {
			account_ids.push(item.id);
		});

		const availablePoints = await Point.find({ account_id: { $in: account_ids } }).sort({ updatedAt: -1 });
		if(!availablePoints) {
			res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
			return;
		}

		availablePoints.forEach((item) => {
			response.available.push(item);
		});
	}

	if(response.owner.length == 0 && response.available.length == 0) {
		res.send({ code: 4, msg: 'Список пуст' }).status(401).end();
		return;
	}

	res.send({ code: 0, msg: response }).status(200).end();
});

app.get('/points/delete', async function(req, res) {
	const { id } = req.query;

	if (!req.cookies || !id) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if (!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	await Point.deleteOne({ _id: id, account_id: account.id });

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/checkpoints/add', async function(req, res) {
	const { id } = req.query;

	if (!req.cookies || !id) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if (!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	let available = [];

	const ownerPoints = await Point.find({ account_id: account.id });
	if(!ownerPoints) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	ownerPoints.forEach((item) => {
		available.push(item.id);
	});

	let account_ids = [];

	const accounts = await Account.find({ login: { $in: account.accounts_access } });
	if(accounts) {
		accounts.forEach((item) => {
			account_ids.push(item.id);
		});

		const availablePoints = await Point.find({ account_id: { $in: account_ids } });
		if(!availablePoints) {
			res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
			return;
		}

		availablePoints.forEach((item) => {
			available.push(item.id);
		});
	}

	if(available == 0) {
		res.send({ code: 4, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	if(!available.includes(id)) {
		res.send({ code: 1, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	const newCheckpoint = new Checkpoint({
		qr_url: '',
		point_id: id
	});

	// const url = req.protocol + '://' + req.get('host') + '/' + newCheckpoint.id + '/';
	const url = `http://localhost:5173/open/${ newCheckpoint.id }/`;

	newCheckpoint.qr_url = await QRCode.toDataURL(url);

	await newCheckpoint.save();

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/checkpoints/get', async function(req, res) {
	const { id } = req.query;

	if (!req.cookies || !id) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if (!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	let available = [];

	const ownerPoints = await Point.find({ account_id: account.id });
	if(!ownerPoints) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	ownerPoints.forEach((item) => {
		available.push(item.id);
	});

	let account_ids = [];

	const accounts = await Account.find({ login: { $in: account.accounts_access } });
	if(accounts) {
		accounts.forEach((item) => {
			account_ids.push(item.id);
		});

		const availablePoints = await Point.find({ account_id: { $in: account_ids } });
		if(!availablePoints) {
			res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
			return;
		}

		availablePoints.forEach((item) => {
			available.push(item.id);
		});
	}

	if(available.length == 0) {
		res.send({ code: 5, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	if(!available.includes(id)) {
		res.send({ code: 5, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	const checkpoints = await Checkpoint.find({ point_id: id }).sort({ updatedAt: -1 }).populate('point_id');
	if(!checkpoints) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if(checkpoints.length == 0) {
		res.send({ code: 4, msg: 'Список пуст' }).status(401).end();
		return;
	}

	res.send({ code: 0, msg: checkpoints }).status(200).end();
});

app.get('/checkpoints/delete', async function(req, res) {
	const { id } = req.query;

	if (!req.cookies || !id) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if (!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	let available = [];

	const ownerPoints = await Point.find({ account_id: account.id });
	if(!ownerPoints) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	ownerPoints.forEach((item) => {
		available.push(item.id);
	});

	let account_ids = [];

	const accounts = await Account.find({ login: { $in: account.accounts_access } });
	if(accounts) {
		accounts.forEach((item) => {
			account_ids.push(item.id);
		});

		const availablePoints = await Point.find({ account_id: { $in: account_ids } });
		if(!availablePoints) {
			res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
			return;
		}

		availablePoints.forEach((item) => {
			available.push(item.id);
		});
	}

	if(available.length == 0) {
		res.send({ code: 5, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	const checkpoint = await Checkpoint.findOne({ _id: id });
	if(!checkpoint) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if(!available.includes(String(checkpoint.point_id))) {
		res.send({ code: 5, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	await Checkpoint.deleteOne({ _id: id });

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/checkpoint/get', async function(req, res) {
	const { id } = req.query;

	if (!req.cookies || !id) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const userSession = await Session.findOne({ _id: sessionToken });
	if (!userSession) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if (!userSession.login) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: userSession.login });
	if (!account) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	let available = [];

	const ownerPoints = await Point.find({ account_id: account.id });
	if(!ownerPoints) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	ownerPoints.forEach((item) => {
		available.push(item.id);
	});

	let account_ids = [];

	const accounts = await Account.find({ login: { $in: account.accounts_access } });
	if(accounts) {
		accounts.forEach((item) => {
			account_ids.push(item.id);
		});

		const availablePoints = await Point.find({ account_id: { $in: account_ids } });
		if(!availablePoints) {
			res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
			return;
		}

		availablePoints.forEach((item) => {
			available.push(item.id);
		});
	}

	if(available.length == 0) {
		res.send({ code: 5, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	let checkpoint;

	try {
		checkpoint = await Checkpoint.findOne({ _id: id });
		if(!checkpoint) {
			res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
			return;
		}
	}
	catch(error) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	if(!available.includes(String(checkpoint.point_id))) {
		res.send({ code: 5, msg: 'Ошибка доступа' }).status(401).end();
		return;
	}

	res.send({ code: 0, msg: checkpoint }).status(200).end();
});