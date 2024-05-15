const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/index')

const registration = async (req, res) => {
    const {login, password} = req.body;

    if(!login || !password) {
        return res.status(404).json({message: "Не переданы логин или пароль"})
    }

    try {
        const candidate = await User.findOne({where: {login}});

        if(candidate) {
            return res.status(404).json({message: "Пользователь с таким логином уже существует"})
        }
    
        const hashPassword = bcrypt.hashSync(password, 7);
    
        const newUser = await User.create({login, password: hashPassword});
    
        return res.json(newUser.id);
    }

    catch (error) {
        console.log(error);
        
        return res.status(500).json({message: error.message})
    }
};

const login = async (req, res) => {
    const {login, password} = req.body;

    if(!login || !password) {
        return res.status(404).json({message: "Не переданы логин или пароль"})
    }

    try {
        const user = await User.findOne({where: {login}});

        if(!user) {
            return res.status(404).json({message: "Пользователь с таким логином отсутствует"})
        }
    
        const isPassEquals = await bcrypt.compare(password, user.password);
    
        if(!isPassEquals) {
            return res.status(404).json({message: "Некорректный пароль"})
        }

        const accessToken = jwt.sign({userId: user.dataValues.id}, process.env.TOKEN_SECRET_KEY, {expiresIn: "30d"})

        return res.cookie("access_token", accessToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}).json(user.id)     
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({message: error.message})
    }

}

module.exports = {registration, login}