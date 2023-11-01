import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['manager', 'staff'],
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true

    }
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
