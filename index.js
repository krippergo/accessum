const express = require('express');
const app = express();
const port = 3005;

app.listen(port, function () {
	console.log(`http://localhost:${port}`);
});

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const cookieParser = require('cookie-parser');
const secret = 'z4g33r';

app.use(cookieParser(secret));

app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/accessum');

// const visitSchema = new mongoose.Schema({
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

// const pointSchema = new mongoose.Schema({
// 	name: {
// 		type: String,
// 		required: true
// 	},
// 	visits: {
// 		type: mongoose.ObjectId,
// 		ref: 'point'
// 	}
// });

// const Point =  mongoose.model('point', pointSchema);

// const connectionSchema = new mongoose.Schema({
// 	type: {
// 		type: String,
// 		required: true
// 	},
// 	points: {
// 		type: mongoose.ObjectId,
// 		ref: 'point'
// 	}
// });

// const Connection =  mongoose.model('connection', connectionSchema);

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
	connections: {
		type: mongoose.ObjectId,
		ref: 'connection'
	}
});

const Account = mongoose.model('account', accountSchema);

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
		res.status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.status(401).end();
		return;
	}

	res.cookie('session_token', '', { expires: new Date(), httpOnly: true, use_only_cookies: true });
	res.status(200).end();
});





// app.get('/account/points', async function(req, res) {
// 	if (!req.cookies) {
// 		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
// 		return;
// 	}

// 	const sessionToken = req.cookies['session_token'];
// 	if (!sessionToken) {
// 		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
// 		return;
// 	}

// 	const userSession = await Session.findOne({ _id: sessionToken });
// 	if (!userSession) {
// 		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
// 		return;
// 	}

// 	if (!userSession.login) {
// 		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
// 		return;
// 	}

// 	const account = await Account.findOne({ login: userSession.login });
// 	if (!account) {
// 		res.send({ code: 1, msg: 'Ошибка сервера' }).status(401).end();
// 		return;
// 	}

// 	res.send(account).status(200).end();
// });