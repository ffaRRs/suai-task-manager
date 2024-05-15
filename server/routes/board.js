const router = require('express').Router()
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../controllers/board')

router.get('/', getAll)
router.get('/:boardId', getOne)

router.post('/', createOne)

router.put('/:boardId', updateOne)

router.delete('/:boardId', deleteOne)


module.exports = router 