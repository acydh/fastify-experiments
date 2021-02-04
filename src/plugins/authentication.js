'use strict';

const fastifyPlugin = require('fastify-plugin');

const authentication = async function(fastify, opts) {
    fastify.register(require("fastify-jwt"), {
        secret: '42obviously', // For testing purposes. It will be placed in a .env, obviously.
        cookie: { 
            cookieName: 'token'
        }
    })

    fastify.decorate("authenticate", async function(request, reply) { // Denies access to routes to non authenticated users
      if (!request.user) {
        return reply.code(401).send({error: "Not authenticated"})
      }
    })

    fastify.decorate("authenticateAdmin", async function(request, reply) { // Denies access to routes to non admin users 
      if (!request.user && request.user.role !== "admin") {
        return reply.code(401).send({error: "Not authorized"});
      }
    });
}

module.exports = fastifyPlugin(authentication);
