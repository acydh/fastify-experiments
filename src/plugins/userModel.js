const fastifyPlugin = require('fastify-plugin');
const { DataTypes } = require('sequelize');

async function userModel (fastify, options, done) {
    const User = fastify.db.define("user", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING,
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    fastify.decorate("userModel", User);
    done();
}

module.exports = fastifyPlugin(userModel);