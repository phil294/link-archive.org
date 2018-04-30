import mongoose from 'mongoose';

export default mongoose.model('User', new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
}));

