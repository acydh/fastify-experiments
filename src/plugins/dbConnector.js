'use strict';

const fastifyPlugin = require('fastify-plugin');

async function dbConnector (fastify, options, done) {
    fastify.register(require('sequelize-fastify'), {
        instance: 'db',
        sequelizeOptions: {
            database: 'data',
            dialect: 'sqlite',
            storage: './data.sqlite',
        }
      });
    done();
}

module.exports = fastifyPlugin(dbConnector);