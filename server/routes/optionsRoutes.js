import express from 'express'
import { getOptionsCatalog } from '../controllers/optionsController.js'

const router = express.Router()

router.get('/', getOptionsCatalog)

export default router
