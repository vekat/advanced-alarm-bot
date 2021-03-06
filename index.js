var Hapi = require('hapi');
var TelegramApi = require('./app/controllers');
var botan = require('botanio')(process.env.BOTAN_TOKEN);

var token = process.env.BOT_TOKEN || process.argv[2];
var host = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || 443;
var url = process.env.OPENSHIFT_APP_DNS;

var bot_api_url = 'https://'+ url + '/bot' + token;

var telegram = new TelegramApi();
telegram.setToken(token);

var server = new Hapi.Server();
server.connection({ host: host, port: port });

server.route({
	method: 'POST',
	path: '/bot'+telegram.getToken(),
	handler: function (request, reply) {
		var payload = request.payload;
		botan.track(payload.message, 'Start');
		telegram.handleMessage(reply, payload.message);
	}
});

server.start(function() {
	console.log('Telegram Bot listening at ', server.info.uri);
	telegram.setWebhook(bot_api_url);
});

