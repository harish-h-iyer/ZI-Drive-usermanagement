const bcrypt = require('bcrypt');
const userModel = require("../../models/UserModel");
const commonUtils = require("../../utils/CommonUtils");
const userDto = require("../DataTransfer/UserDto");
const path = require("path");
const fse = require("fs-extra");
const folderModel = require("../../models/FolderModel");
const folderDto = require("../DataTransfer/FolderDto");

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
                        callback(null, {message: error});
                    }else{
                        var uploadDirectory = process.env.UPLOAD_PATH;

                        console.log("Generating root folder........");

                        var fileDirectory = data.email;

                        console.log("FolderName: " + fileDirectory);

                        const directoryPath = path.join(uploadDirectory, fileDirectory);

                        console.log("Creating Folder at " + directoryPath);
                        fse.ensureDirSync(directoryPath, (error, result) => {
                             // => null
                            if(error){
                                console.log(error.stack);
                            }                            
                            // dir has now been created, including the directory it is to be placed in
                        })

                        var folderObj = new folderModel(folderDto.savefolderObject(data.email, fileDirectory));

                        console.log(folderObj);
                        folderObj.save(folderObj, function(error, result){
                            if(error){
                                var message = {
                                    message: error
                                }
                                callback(null, message);
                            }
                        })


                        callback(null, response)
                    }
                });
            });
        }
    }

    deleteUser = (call, callback) => {
        var data = call.request;
        console.log(data);
        var query = {
            email: data.email
        };
        userModel.findOneAndDelete(query, function(error, foundUser){
            if(error){
                callback(null, error);
            }else{
                console.log(foundUser);
                var uploadDirectory = process.env.UPLOAD_PATH;

                console.log("Generating root folder........");
                var fileDirectory = data.email+"/";
                console.log("FolderName: " + fileDirectory);
                const directoryPath = path.join(uploadDirectory, fileDirectory);
                console.log("Removing Folder at " + directoryPath);
                fse.remove(directoryPath, (error, result) => {
                     // => null
                    if(error){
                        console.log(error.stack);
                    }                            
                    // dir has now been created, including the directory it is to be placed in
                });
                var query = {
                    owner: data.email,
                    isRoot: true
                }
                folderModel.findOneAndDelete(query, function(error, deletedFolder){
                    if(error){
                        var message = {
                            message: error
                        };
                        callback(null, message);
                    }else{
                        var message = {
                            message: "User deleted Successfully"
                        };
                        callback(null, message);
                    }
                })
            }
        })
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