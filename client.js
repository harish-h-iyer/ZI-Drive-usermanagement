const grpc = require('grpc');
const loader = require('@grpc/proto-loader');
const package = loader.loadSync('user.proto', {});
const object = grpc.loadPackageDefinition(package);
const userPackage = object.userPackage;

const client  = new userPackage.User('localhost:5000', grpc.credentials.createInsecure())

const email = process.argv[2];
const firstName = process.argv[3];
const lastName = process.argv[4];
const phoneNumber = process.argv[5];
const gender = process.argv[6];
const password = process.argv[7];

const toFindEmail = process.argv[8];

client.createUser({email: email, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, gender: gender, password: password}, (error, response) => {
    console.log("Error : ", error); 
    console.log("Response : ", response); 
});

// client.readUser({email: toFindEmail}, (error, response)=> {
//     console.log("Error: ", error);
//     console.log("Response: ", response);
// })

// client.deleteUser({email: email}, (error, response)=> {
//     console.log("Error: ", error);
//     console.log("Response: ", response);
// })