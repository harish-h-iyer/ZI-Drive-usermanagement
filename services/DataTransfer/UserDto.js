exports.saveUserObject = function(data, hash) {
    return {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        password: hash,
        created_at: new Date()
    }
}