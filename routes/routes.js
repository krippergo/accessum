module.exports = (router, hash) => {
	require('./account/account')(router, hash);

	require('./points/points')(router);

	require('./checkpoints/checkpoints')(router);
};