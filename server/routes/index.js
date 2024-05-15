const authRouter = require('./auth')
const boardRouter = require('./board')
const sectionRouter = require('./section')

const router = require('express').Router()

router.use('/auth', authRouter)
router.use('/boards', boardRouter)
router.use('/boards/:boardId/sections', sectionRouter)
// router.use('/boards/:boardId/tasks', require('./task'))

module.exports = router