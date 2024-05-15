const {Section, Task} = require('../models/index')

const createOne = async (req, res) => {
    const { boardId } = req.params
    const { title } = req.body
    const { access_token } = req.cookies;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    if(!title) {
        return res.status(404).json({message: "Не переданы обязательные поля"})
    }

    try {
        const section = await Section.create({title, boardId}, {where: {boardId}})
        res.status(201).json(section.id)

    } catch (err) {
        res.status(500).json(err)
    }
}
  
const updateOne = async (req, res) => {
    const { sectionId } = req.params
    const { access_token } = req.cookies;
    const {title} = req.body;

    if(!access_token) {
          return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    if(!title) {
        return res.status(404).json({message: "Не переданы обязательные поля"})
    }

    try {
        const section = await Section.findByPk(sectionId);

        if (!section) return res.status(404).json({message: 'Секция не найдена'});

        section.title = title

        const updatedSection = await section.save();

        res.status(200).json(updatedSection)
    } catch (err) {
        res.status(500).json(err)
    }
}
  
const deleteOne = async (req, res) => {
    const { sectionId } = req.params
    const { access_token } = req.cookies;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    try {
        const section = await Section.findByPk(sectionId);

        if (!section) return res.status(404).json({message: 'Секция не найдена'});

        await Task.destroy({where: {sectionId}})
        const deletedSectionCount = await Section.destroy({where: {id: sectionId}})

        res.status(200).json(deletedSectionCount)
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {createOne, updateOne, deleteOne}