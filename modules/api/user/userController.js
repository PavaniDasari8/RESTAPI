'use strict';

let Model = require('./userModel.js').model;
let fillData = require('./userModel.js').fillData;
let utill = require('../../utill.js');
const comparePassword = require('./userModel.js').comparePassword;

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
    const userName = request.body.userName;
    const password = request.body.password;
    Model.findOne({
        $or: [
            { userName: userName },
            { email: userName }
        ]
    }).exec(function (err, user) {
        if (err) { res.json(utill.responseErrorJSON(401, 'error', err)); }
        if (!user) {
            response.json(utill.responseErrorJSON(401, `User ${userName} not found.`, 'Error'));
        }
        if (user) {
            comparePassword(password, user.password, (error, isMatch) => {
                if (error) { response.json(utill.responseErrorJSON(401, 'error', error)); }
                if (isMatch) {
                    response.json(utill.responseSuccessJSON(200, 'success', user));
                } else {
                    response.json(utill.responseErrorJSON(401, "Invalid password.", 'Error'));
                }
            });
        }
    });
};

/**
 *  This Method is used for Signup
 *
 */
const signup = (request, response) => {
    Model.findOne({ email: request.body.email }, (err, existingstudent) => {
        if (err) {
            response.json(utill.responseErrorJSON(401, "error", err));
        }
        if (existingstudent) {
            response.json(utill.responseErrorJSON(401, "User with that email address already exists.", 'Error'));
        }
        else {
            let filledModel = fillData(request.body);
            const _model = new Model(filledModel);
            _model.save((error, user) => {
                if (err) {
                    response.json(utill.responseErrorJSON(401, 'error', error));
                }
                response.json(utill.responseSuccessJSON(200, 'success', user));
            });
        }
    });
}

/**
 *  This Method is used for userName validation
 *
 */
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

/**
 *  This Method is used for email validation
 *
 */
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
 * This method is used to remove
 */
const remove = (request, response) => {
    Model.findByIdAndRemove(request.params.id, err => {
        if (err) {
            response.json(utill.responseErrorJSON(401, 'error', err));
        }
        response.json(utill.responseSuccessJSON(200, 'user deleted successfully', []));
    });
};

module.exports = { get, getbyid, login, signup, validUserName, validEmail, put, remove };
