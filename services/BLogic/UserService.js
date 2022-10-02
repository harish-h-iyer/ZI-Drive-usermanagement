const bcrypt = require('bcrypt');
const userModel = require("../../models/UserModel");
const commonUtils = require("../../utils/CommonUtils");
const userDto = require("../DataTransfer/UserDto");


module.exports = class API {
    constructor(db, grpc) {
        this.db = db;
        this.grpc = grpc;
    }

    register = (call, callback) => {
        var data = call.request;
        console.log(call);
        if (!commonUtils.checkEmptyFieldValue(data.email) || !commonUtils.checkEmptyFieldValue(data.password) || !commonUtils.checkEmptyFieldValue(data.firstName)){
            console.log("Incomplete Data Recieved While Creating User.");
            callback(response, null);
        }else{
            bcrypt.hash(call.request.password, 10, (err, hash) => {    
                var userObject = new userModel(userDto.saveUserObject(data, hash));

                console.log(userObject);
                userObject.save(userObject, function(error, response){
                    if(error){
                        callback(null, {items: error});
                    }else{
                        callback(null, response)
                    }
                });
            });
        }
    }

    readUser = (call, callback) => {
        var data = call.request;
        console.log(data);
        var query = {
            email: data.email
        };
        userModel.findOne(query, function(error, foundUser){
            if(error){
                callback(null, error);
            }else{
                console.log(foundUser);
                callback(null, foundUser);
            }
        })
    }
};