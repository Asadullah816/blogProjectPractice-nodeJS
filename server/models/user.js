const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: [true, "Email aleady exists"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}
)

module.exports = User = mongoose.model('user', userSchema);