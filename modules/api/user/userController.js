'use strict';

let Model = require('./userModel.js').model;
let fillData = require('./userModel.js').fillData;
let utill = require('../../utill.js');
const comparePassword = require('./userModel.js').comparePassword;
const async = require("async");
const crypto = require("crypto");

/**
  * This Method get the all users
  */
const get = (request, response) => {
    Model.find({ "is_active": "true" }, (err, user) => {
        if (err) {
            response.json(utill.responseErrorJSON(401, 'error', err));
        }
        response.json(utill.responseSuccessJSON(200, 'success', user));
    });
};
/**
 *  This method is used to get single user details by ID
 * 
 */
const getbyid = (request, response) => {
    Model.find({ $and: [{ '_id': request.params.id }, { "is_active": "true" }] }, (err, user) => {
        if (err) {
            response.json(utill.responseErrorJSON(401, 'error', err));
        }
        response.json(utill.responseSuccessJSON(200, 'success', user));
    });
};

/**
 *  This Method is used for Login with email and password
 *
 */
const login = (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    Model.findOne({ email: email }, (err, user) => {
        if (err) { res.json(utill.responseErrorJSON(401, 'error', err)); }
        if (!user) {
            response.json(utill.responseErrorJSON(401, `Email ${email} not found.`, 'Error'));
        }
        if (user) {
            comparePassword(password, user.password, (err, isMatch) => {
                if (err) { response.json(utill.responseErrorJSON(401, 'error', err)); }
                if (isMatch) {
                    async.waterfall([
                        function createRandomToken(done) {
                            crypto.randomBytes(16, (err, buf) => {
                                const token = buf.toString("hex");
                                done(err, token);
                            });
                        },
                        function setRandomToken(token, done) {
                            user.token = token;
                            Model.findOneAndUpdate({ '_id': user._id }, user, (err, userInfo) => {
                                if (err) { response.json(utill.responseErrorJSON(401, 'error', err)); }
                                if (userInfo) {
                                    response.json(utill.responseSuccessJSON(200, 'success', userInfo));
                                }
                            })
                        }
                    ]);
                } else {
                    response.json(utill.responseErrorJSON(401, "Invalid email or password.", 'Error'));
                }
            });
        }
    })
};

const signup = (request, response) => {
    Model.findOne({ email: request.body.email }, (err, existingstudent) => {
        if (err) { return next(err); }
        if (existingstudent) {
            response.json(utill.responseErrorJSON(401, "User with that email address already exists.", 'Error'));
        }
        else {
            async.waterfall([
                function createRandomToken(done) {
                    crypto.randomBytes(16, (err, buf) => {
                        const token = buf.toString("hex");
                        done(err, token);
                    });
                },
                function setRandomToken(token, done) {
                    request.body.token = [{ token }];
                    let filledModel = fillData(request.body);
                    const _model = new Model(filledModel);
                    _model.save((err, user) => {
                        if (err) {
                            response.json(utill.responseErrorJSON(401, 'error', err));
                        }
                        response.json(utill.responseSuccessJSON(200, 'success', user));
                    });
                }
            ]);
        }
    });
}

const validUserName = (request, response) => {
    Model.find({ 'userName': request.params.userName }, (err, user) => {
        if (user && user.length != 0)
            response.json(utill.responseErrorJSON(401, 'error', 'User Name already exists' + user));
        else if (err)
            response.json(utill.responseErrorJSON(401, 'error', err));
        else
            response.json(utill.responseSuccessJSON(200, 'success', 'User Name does`nt exists'));
    });
}

const validEmail = (request, response) => {
    Model.find({ 'email': request.params.email }, (err, user) => {
        if (user && user.length != 0)
            response.json(utill.responseErrorJSON(401, 'error', 'Email already exists' + user));
        else if (err)
            response.json(utill.responseErrorJSON(401, 'error', err));
        else
            response.json(utill.responseSuccessJSON(200, 'success', 'Email does`nt exists'));
    });
}


/**
 * 
 * 
 * This method is used to update the user details by ID
 */
const put = (request, response) => {
    Model.findOneAndUpdate({ '_id': request.params.id }, request.body, (err, user) => {
        if (err) {
            response.json(utill.responseErrorJSON(401, 'error', err));
        }

        Model.findById(user._id, (err, user) => {
            if (err) {
                response.json(utill.responseErrorJSON(401, 'error', err));
            }
            response.json(utill.responseSuccessJSON(200, 'success', [user]));
        });
    })
};
/**
 * 
 * This method is used to soft remove user details by ID 
 */
const remove = (request, response) => {
    Model.findByIdAndRemove(req.params.id, err => {
        if (err) {
            response.json(utill.responseErrorJSON(401, 'error', err));
        }
        response.json(utill.responseSuccessJSON(200, 'user deleted successfully', []));
    });
};

module.exports = { get, getbyid, login, signup, validUserName, validEmail, put, remove };
