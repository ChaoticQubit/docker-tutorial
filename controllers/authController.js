const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
    const {name, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({name, email, password: hashedPassword});
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (e) {
        res.status(400).json({
            status: 'fail',
            message: e
        });
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const correct = await bcrypt.compare(password, user.password)

        if(!correct){
            res.status(404).json({
                status: 'fail',
                message: 'Incorrect password'
            });
        }else{
            req.session.user = user;
            res.status(200).json({
                status: 'success',
                data: {
                    user
                }
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'fail',
            message: e
        });
    }
}