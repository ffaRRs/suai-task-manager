const { createOne, updateOne, deleteOne } = require('../controllers/task')

const router = require('express').Router({ mergeParams: true })

router.post('/', createOne)

router.put('/:taskId', updateOne)

router.delete('/:taskId', deleteOne)

module.exports = router

