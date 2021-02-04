'use strict';

const helpers = require('./helpers');
const bcrypt = require('bcrypt');

const controllers = {

    getUsers: async (request, reply, fastify) => {
        const users = await fastify.userModel.findAll();
        reply
            .code(200)
            .send(JSON.stringify(users));
    },

    signup: async (request, reply, fastify) => {
        const { username, password, repeatPassword } = request.body;
        if (password !== repeatPassword) {
            return reply.code(409).send({ error: "Passwords must coincide" });
        }
        const userExists = await fastify.userModel.findOne({
            where: {
                username: username,
            }
        });
        if (userExists) {
            return reply.code(409).send({ error: "Username already taken" });
        }
        bcrypt.hash(password, 13) 
            .then(hash => {
                const newUser = fastify.userModel.build({
                    username,
                    password: hash,
                    role: "user",
                });
                return newUser.save()
                    .then(res => {
                        helpers.sendAuthCookie(reply, fastify, { username: res.username, role: res.role });
                    })
                    .catch(err => {
                        console.log(err);
                        helpers.sendGenericServerError(reply);
                    })
            })
            .catch(err => {
                console.log(err);
                helpers.sendGenericServerError(reply);
            });
    },

    login: (request, reply, fastify) => {
        const { username, password } = request.body;
        return fastify.userModel.findOne({
            where: {
                username: username
            }
        })
        .then(res => {
            if (!res) {
                helpers.sendGenericLoginError(reply); // to do: add a delay for preventing side-channel timing attacks
            } else {
                bcrypt.compare(password, res.password, function(err, result) {
                    if (!err) {
                        helpers.sendAuthCookie(reply, fastify, { username: res.username, role: res.role });
                    } else {
                        helpers.sendGenericLoginError(reply);
                    }  
                });
            }
        })
        .catch(err => {
            console.log(err);
            helpers.sendGenericLoginError(reply);
        })
    },

    logout: (request, reply, fastify) => {
        reply
            .code(200)
            .clearCookie('token', {path: '/'})
            .send({message: "Logged out"})
    }
}

module.exports = controllers