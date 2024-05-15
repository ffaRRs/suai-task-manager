const {Board, Section, Task} = require('../models/index')
const jwt = require('jsonwebtoken')


const createOne = async (req, res) => {
    const {title, description} = req.body
    const {access_token} = req.cookies;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    if(!title) {
        return res.status(404).json({message: "Не переданы обязательные поля"})
    }

    const {userId} = jwt.verify(access_token, process.env.TOKEN_SECRET_KEY)


    try {
        const boardsCount = await Board.count()
        const board = await Board.create({
            title,
            userId,
            description: description ?? null,
            position: boardsCount > 0 ? boardsCount : 0,
        })
        res.json(board)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

const getAll = async (req, res) => {
    const {access_token} = req.cookies;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    const {userId} = jwt.verify(access_token, process.env.TOKEN_SECRET_KEY)

    try {
        const boards = await Board.findAll({where: {userId: userId}, order: [['position', "DESC"]] })
        return res.json(boards)
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

const getOne = async (req, res) => {
    const {access_token} = req.cookies;
    const { boardId } = req.params;

    console.log(boardId);

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    const {userId} = jwt.verify(access_token, process.env.TOKEN_SECRET_KEY)

    try {
        const board = await Board.findOne({where: {userId: userId, id: boardId}})

        if (!board) return res.status(404).json('Доска не найдена')

        const boardWithSectionsAndTasks = await Board.findOne({where: {userId: userId, id: boardId}, include: {model: Section, include: {model: Task }}})
        return res.json(boardWithSectionsAndTasks)
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

const updateOne = async (req, res) => {
    const {access_token} = req.cookies;
    const { boardId } = req.params;
    const {title, description} = req.body

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    if(!title && !description) {
        return res.status(404).json({message: "Не переданы поля"})
    }

    const {userId} = jwt.verify(access_token, process.env.TOKEN_SECRET_KEY)

    try {
        const board = await Board.findOne({where: {userId: userId, id: boardId}})

        if (!board) return res.status(404).json({message: 'Доска не найдена'})
        
        if(title) board.title = title
        if(description) board.description = description

        const updatedBoard = await board.save()

        return res.json(updatedBoard)
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

const deleteOne = async (req, res) => {
    const {access_token} = req.cookies;
    const { boardId } = req.params;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    const {userId} = jwt.verify(access_token, process.env.TOKEN_SECRET_KEY)

    try {

        const board = await Board.findOne({where: {userId: userId, id: boardId}})

        if (!board) return res.status(404).json({message: 'Доска не найдена'})

        const sections = await Section.findAll({ where: {boardId: boardId} })

        for (const section of sections) {
            await Task.destroy({where: {sectionId: section.id}})
        }

        await Section.destroy({ where: {boardId: boardId} })
        await Board.destroy({where: {id: board.id}})

        const boards = await Board.findAll({where: {userId: userId}, order: [['position', "ASC"]]})

        for (const key in boards) {
            const board = boards[key]
            await Board.update({position: key}, {where: {id: board.id}})
        }

        return res.json({message: "deleted"})
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {createOne, getAll, getOne, updateOne, deleteOne}