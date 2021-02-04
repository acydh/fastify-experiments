const fastifyPlugin = require('fastify-plugin');
const controllers = require('./controllers')
const schemas = require('./schemas');


async function routes (fastify, options) {

    fastify.get('/admin/users', { preValidation: [fastify.authenticateAdmin] }, async (request, reply) => {
        controllers.getUsers(request, reply, fastify);
    });

    fastify.post('/api/signup', { schema: schemas.signupSchema }, (request, reply) => {
        controllers.signup(request, reply, fastify)
    });
    
    fastify.post('/api/login', (request, reply) => controllers.login(request, reply, fastify));

    fastify.post('/api/logout', { preValidation: [fastify.authenticate] }, (request, reply) => controllers.logout(request, reply, fastify));

    fastify.get('/protected', { preValidation: [fastify.authenticate] }, (request, reply) => reply.send({message: `Logged as ${request.user.username}`}));

}

module.exports = fastifyPlugin(routes);