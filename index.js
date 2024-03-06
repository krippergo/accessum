const express = require('express'), app = express(), router = express.Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createHmac } = require('node:crypto');

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