const { createOne, updateOne, deleteOne } = require('../controllers/section')

const router = require('express').Router({ mergeParams: true })

router.post('/', createOne)

router.put('/:sectionId', updateOne)

router.delete('/:sectionId', deleteOne)

module.exports = router

