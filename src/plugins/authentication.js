const fastifyPlugin = require('fastify-plugin');

const authentication = async function(fastify, opts) {
    fastify.register(require("fastify-jwt"), {
        secret: '42obviously', // For testing purposes. It will be placed in a .env, obviously.
        cookie: { 
            cookieName: 'token'
        }
    })
  
    fastify.decorate("authenticate", async function(request, reply) {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.code(401).send({error: "Not authenticated"})
      }
    })

    fastify.decorate("authenticateAdmin", async function(request, reply) {
        try {
            const decoded = await request.jwtVerify();
            console.log(decoded);
            if (decoded.role !== "admin") {
                reply.code(401).send({error: "Not authorized"})
            }
          } catch (err) {
            reply.code(401).send({error: "Not authenticated"});
            // reply.code(401).send(err);
          }
      })
}

module.exports = fastifyPlugin(authentication);
