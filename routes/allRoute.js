const express = require("express");
const controller = require('../controller/controller');


const route = express.Router();


//routes
route.get('/register', controller.register_get);
route.post('/register', controller.register_post);
route.get('/login', controller.login_get);
route.post('/login', controller.login_post);
route.get('/logout', controller.logout_get);



module.exports = route;