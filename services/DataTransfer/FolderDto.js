exports.savefolderObject = function(owner, folderName) {
    return {
        owner: owner,
        folderName: folderName,
        isRoot: true,
        description: "Root folder for user " + owner,
        folderPath: "/" + folderName,
        access: owner,
        created_at: new Date()
    }
}