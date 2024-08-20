import User from "./../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10
const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds)
}

const createUser = async (req, res) => {
    
    const { name, email, age, password , type } = req.body
 
    const user = new User({ name, email, age, password: await hashPassword(password) , type })

    const token=jwt.sign({ userId: user._id }, process.env.SECRET_KEY)
    await user.save()

    res.status(201).json({
        message: 'User created successfully',
        user: user,
        token: token
        
    })
}

const getUsers = async (req, res) => {
    const users = await User.find().select('-password')
    res.status(200).json({
        message: 'Users fetched successfully',
        users: users
    })
}

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('name email age password type _id __v')
    
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    res.status(200).json({
        message: 'User fetched successfully',
        user: user

    })
}
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    const { name, email, age, password } = req.body
    user.name = name || user.name
    user.email = email || user.email
    user.age = age || user.age
    if (password) {
        user.password = password || user.password
        return res.status(400).json({
            message: 'Password cannot be updated'
        })
    }
    await user.save()

    res.status(200).json({
        message: 'User updated successfully',
        user: user
    })
}

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    console.log(req.params.id.length())
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    await user.deleteOne()
    res.status(200).json({
        message: 'User deleted successfully'

    })
}
const loginUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(401).json({
            message: 'Invalid password'
        })
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY)
    res.status(200).json({
        message: 'User logged in successfully',
        user: user,
        token: token
    })
}


export {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
}