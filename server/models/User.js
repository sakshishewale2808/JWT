import { Schema, model } from 'mongoose'


const userSchema = new Schema({
    name: {
        type: String,
            required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    token: {
        type: String,
    
    }
    
})

const User = model('User', userSchema)

export default User