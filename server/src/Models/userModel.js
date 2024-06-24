import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const userModel = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    avatar: {
        public_id: String,
        url: String,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },],
    isGuest: { type: Boolean, default: false },
});

// Pre-save hook to hash password and update timestamps
userModel.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this._hashPassword(this.password);
    }
    if (!this.isNew) {
        this.updated_at = Date.now();
    }
    next();
});

// Method to hash password
userModel.methods._hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// Method to authenticate user
userModel.methods.authenticateUser = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Method to create JWT token
userModel.methods.createToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.JWT_KEY,
        { expiresIn: '3d' }
    );
};

// Method to return auth JSON
userModel.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.createToken()
    };
};

// Method to return user JSON
userModel.methods.toJSON = function () {
    return {
        _id: this._id,
        name: this.name,
        username: this.username,
        email: this.email,
        bio: this.bio,
        posts: this.posts,
        avatar: this.avatar,
        followers: this.followers,
        following: this.following,
        created_at: this.created_at,
        updated_at: this.updated_at
    };
};

const User = mongoose.model('User', userModel);
export default User;
