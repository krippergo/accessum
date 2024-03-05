const express = require('express');
const app = express();
const port = 3005;

app.listen(port, function () {
	console.log(`http://localhost:${port}`);
});

const QRCode = require('qrcode');

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const cookieParser = require('cookie-parser');
const secret = 'z4g33r';

app.use(cookieParser(secret));

app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/accessum');

// const visitSchema = new mongoose.Schema({
// 	creator_login: {
// 		type: String,
// 		required: true
// 	},
// 	day: {
// 		type: Date,
// 		required: true
// 	},
// 	start: {
// 		type: Date,
// 		required: true
// 	},
// 	end: {
// 		type: Date,
// 		required: true
// 	}
// });

// const Visit =  mongoose.model('visit', visitSchema);

const sessionSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true
	},
	expiresAt: {
		type: Date,
		required: true
	}
});

const Session =  mongoose.model('session', sessionSchema);

const accountSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	fio: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
	},
	is_opened: {
		type: Boolean,
		default: true
	},
	accounts_access: {
		type: [String],
		default: []
	}
});

const Account = mongoose.model('account', accountSchema);

const pointSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	account_id: {
		type: mongoose.ObjectId,
		ref: 'account'
	}
},
{
	timestamps: true
});

const Point =  mongoose.model('point', pointSchema);

const checkpointSchema = new mongoose.Schema({
	qr_url: {
		type: String
	},
	point_id: {
		type: mongoose.ObjectId,
		ref: 'point'
	}
},
{
	timestamps: true
});

const Checkpoint =  mongoose.model('checkpoint', checkpointSchema);

const { createHmac } = require('node:crypto');

function hash(password) {
	const hashed = createHmac('sha256', secret)
				.update(password)
				.digest('hex');
	
	return hashed;
}

app.post('/account/registration', async function (req, res) {
	const { login, password, fio, type, username } = req.body;

	if (!login || !password || !fio || !username || !type) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: login });

	if(account) {
		res.send({ code: 2, msg: 'Такой логин уже существует' }).status(401).end();
		return;
	}

	const hashedPassword = hash(password);

	const newAccount = new Account({
		login: login,
		password: hashedPassword,
		fio: fio,
		type: type,
		username: username
	});

	await newAccount.save();

	const createdAt = new Date();
	const expiresAt = new Date(createdAt.getTime() + (60 * 60 * 24 * 1000));

	const session = new Session({
		login: login,
		createdAt: createdAt,
		expiresAt: expiresAt
	});

	await session.save();

	const sessionToken = session.id;

	res.cookie('session_token', sessionToken, { expires: expiresAt, httpOnly: true, use_only_cookies: true });
	res.send({ code: 0, msg: '' }).status(200).end();
});

app.post('/account/authorization', async function (req, res) {
	const { login, password } = req.body;

	if (!login || !password) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const account = await Account.findOne({ login: login });

	if(!account) {
		res.send({ code: 3, msg: 'Неверный логин или пароль' }).status(401).end();
		return;
	}

	const accountPassword = account.password;
	const recivedPassword = hash(password);

	if (!accountPassword || accountPassword !== recivedPassword) {
		res.send({ code: 3, msg: 'Неверный логин или пароль' }).status(401).end();
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

	const sessionToken = session.id;

	res.cookie('session_token', sessionToken, { expires: expiresAt, httpOnly: true, use_only_cookies: true });
	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/account/authorized', async function(req, res) {
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

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/account/rights', async function(req, res) {
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

	account.is_opened = !account.is_opened;

	await account.save();

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.get('/account', async function(req, res) {
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

	account.password = '';

	res.send({ code: 0, msg: account }).status(200).end();
});

app.post('/account/edit', async function (req, res) {
	const { password, newpassword } = req.body;

	if (!password || !newpassword || !req.cookies) {
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
		res.send({ code: 3, msg: 'Неверный логин или пароль' }).status(401).end();
		return;
	}

	const accountPassword = account.password;
	const recivedPassword = hash(password);

	if (!accountPassword || accountPassword !== recivedPassword) {
		res.send({ code: 3, msg: 'Неверный логин или пароль' }).status(401).end();
		return;
	}

	const newAccountPassword = hash(newpassword);
	account.password = newAccountPassword;

	await account.save();

	res.send({ code: 0, msg: '' }).status(200).end();
});

app.post('/account/exit', async function(req, res) {
	if (!req.cookies) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
		return;
	}

	res.cookie('session_token', '', { expires: new Date(), httpOnly: true, use_only_cookies: true });
	res.send({ code: 0, msg: '' }).status(200).end();
});

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