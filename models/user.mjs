import mongoose from 'mongoose';

const externalTypes = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
};

const userSchema = new mongoose.Schema({
    /* _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    }, */
    email: {
        type: String,
        required: false,
    },
    externalType: {
        type: String,
        enum: Object.values(externalTypes),
        required: false,
    },
    externalIdentifier: {
        type: Number,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    picture: {
        type: String,
        required: false,
    },
});
userSchema.pre('validate', function validate(next) {
    if (!(this.externalType && this.externalIdentifier) && !this.email) {
        next(new Error('missing: email or externalType'));
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);

export { User, externalTypes };
