const {Task, Section} = require('../models/index')

const createOne = async (req, res) => {
    const { sectionId } = req.params
    const { title } = req.body
    const { access_token } = req.cookies;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    if(!title) {
        return res.status(404).json({message: "Не переданы обязательные поля"})
    }

    try {
        const section = await Section.findByPk(sectionId)

        if(!section) return res.status(404).json({message: 'Секция не найдена'})

        const tasksCount = await Task.count();

        const task = await Task.create({
            title,
            sectionId,
            position: tasksCount > 0 ? tasksCount : 0
          })

        res.status(201).json(task)

    } catch (err) {
        res.status(500).json(err)
    }
};

const updateOne = async (req, res) => {
    const { taskId, sectionId } = req.params
    const { access_token } = req.cookies;
    const {title, content} = req.body;

    if(!access_token) {
          return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    if(!title && !content) {
        return res.status(404).json({message: "Не переданы поля"})
    }

    try {
        const section = await Section.findByPk(sectionId);
        const task = await Task.findByPk(taskId)

        if (!section) return res.status(404).json({message: 'Секция не найдена'});
        if (!task) return res.status(404).json({message: 'Задача не найдена'});

        if(title) task.title = title
        if(content) task.content = content

        const updatedTask = await task.save();

        res.status(200).json(updatedSection)
    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteOne = async (req, res) => {
    const {access_token} = req.cookies;
    const { taskId, sectionId } = req.params;

    if(!access_token) {
        return res.status(403).json({message: "Пользователь не находится в системе!"})
    }

    const {userId} = jwt.verify(access_token, process.env.TOKEN_SECRET_KEY)

    try {

        const section = await Section.findByPk(sectionId);
        const task = await Task.findByPk(taskId)

        if (!section) return res.status(404).json({message: 'Секция не найдена'});
        if (!task) return res.status(404).json({message: 'Задача не найдена'});


        const deletedTask = await Task.destroy({where: {id: taskId}})

        const tasks = await Task.findAll({where: {sectionId}, order: [['position', "ASC"]]})

        for (const key in tasks) {
            const task = tasks[key]
            await Task.update({position: key}, {where: {id: task.id}})
        }

        return res.json({message: "deleted"})
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {createOne, updateOne, deleteOne}