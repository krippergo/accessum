module.exports = async (req, res) => {
	if (!req.cookies) {
		res.status(401).end();
		return;
	}

	const sessionToken = req.cookies['session_token'];
	if (!sessionToken) {
		res.status(401).end();
		return;
	}

	res.cookie('session_token', '', { expires: new Date(), httpOnly: true, use_only_cookies: true }).status(200).end();
};