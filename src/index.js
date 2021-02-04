'use strict';

const path = require('path'); 
const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-cookie'));
fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug')
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
});
fastify.register(require('fastify-formbody'));

fastify.register(require('./plugins/dbConnector'));
fastify.register(require('./plugins/userModel'));
fastify.register(require('./plugins/authentication'));
fastify.register(require('./routes'));

fastify.addHook('onRequest', async (request, reply) => { // todo: check fastify-auth plugin
  try {
    await request.jwtVerify(); // Assigns jwt token values to request.user object at every request
  } catch(err) { }; // Just means that the user is not authenticated, so request.user == null, do nothing
})

fastify.listen(4000, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.db.sync({ force: false }); // set to TRUE for a DB reset on reboot
  fastify.log.info(`server listening on ${address}`)
})





