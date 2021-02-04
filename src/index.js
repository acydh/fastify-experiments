'use strict';

const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-cookie'));

fastify.register(require('./plugins/dbConnector'));
fastify.register(require('./plugins/userModel'));
fastify.register(require('./plugins/authentication'));
fastify.register(require('./routes'));

fastify.listen(4000, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.db.sync({ force: false }); // set to TRUE for a DB reset on reboot
  fastify.log.info(`server listening on ${address}`)
})





