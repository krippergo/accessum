module.exports = (router, hash) => {
	router.get('/server/account/authentication', async (req, res) => {
		require('./handlers/authentication')(req, res)
	});

	router.get('/server/account/data', async (req, res) => {
		require('./handlers/data')(req, res)
	});

	router.get('/server/account/exit', async (req, res) => {
		require('./handlers/exit')(req, res)
	});
	
	router.post('/server/account/authorization', async (req, res) => {
		require('./handlers/authorization')(req, res, hash)
	});

	router.post('/server/account/registration', async (req, res) => {
		require('./handlers/registration')(req, res, hash)
	});

	router.post('/server/account/edit', async (req, res) => {
		require('./handlers/edit')(req, res, hash)
	});

	router.put('/server/account/opened', async (req, res) => {
		require('./handlers/opened')(req, res)
	});
};