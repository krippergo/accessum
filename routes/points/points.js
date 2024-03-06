module.exports = (router) => {
	router.get('/server/points/data', async (req, res) => {
		require('./handlers/data')(req, res)
	});

	router.post('/server/points/create', async (req, res) => {
		require('./handlers/create')(req, res)
	});

	router.delete('/server/points/delete', async (req, res) => {
		require('./handlers/delete')(req, res)
	});
};