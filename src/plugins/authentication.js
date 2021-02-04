'use strict';

const fastifyPlugin = require('fastify-plugin');

const authentication = async function(fastify, opts) {
    fastify.register(require("fastify-jwt"), {
        secret: '42obviously', // For testing purposes. It will be placed in a .env, obviously.
        cookie: { 
            cookieName: 'token'
        }
    })
    
    fastify.decorate("getToken", async function(request, reply) { // Tries to get the token and assign the values to request.user globally
      try {
        await request.jwtVerify()
      } catch (err) {
        // do nothing
      }
    })

    fastify.decorate("authenticate", async function(request, reply) { // Denies access to routes to non authenticated users
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.code(401).send({error: "Not authenticated"})
      }
    })

    fastify.decorate("authenticateAdmin", async function(request, reply) { // Denies access to routes to non admin users 
        try {
            const decoded = await request.jwtVerify();
            if (decoded.role !== "admin") {
                reply.code(401).send({error: "Not authorized"})
            }
          } catch (err) {
            reply.code(401).send({error: "Not authenticated"});
          }
      })
}

module.exports = fastifyPlugin(authentication);
