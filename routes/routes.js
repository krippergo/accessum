module.exports = (router, hash) => {
	require('./account/account')(router, hash);
};