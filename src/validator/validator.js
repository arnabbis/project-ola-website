
const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValid2 = function(value) {
    if (typeof(value) === "string" && (value).trim().length === 0) { return false }
    return true
}

const isValidPhoneNo = /^\+?([6-9]{1})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/

const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
