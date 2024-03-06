module.exports = (router) => {
	router.get('/server/checkpoints/get', async (req, res) => {
		require('./handlers/get')(req, res)
	});

	router.get('/server/checkpoints/data', async (req, res) => {
		require('./handlers/data')(req, res)
	});

	router.get('/server/checkpoints/create', async (req, res) => {
		require('./handlers/create')(req, res)
	});

	router.delete('/server/checkpoints/delete', async (req, res) => {
		require('./handlers/delete')(req, res)
	});
};