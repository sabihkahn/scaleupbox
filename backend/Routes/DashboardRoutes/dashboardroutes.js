import express from 'express'
import { dashborddata } from '../../controller/Dashboardcontroller.js'
import { authorization } from '../../middleware/Authorization.js'
const router = express.Router()

router.get('/data/dashboard',authorization,dashborddata)


export default router