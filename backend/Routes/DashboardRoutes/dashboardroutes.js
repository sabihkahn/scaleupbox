import express from 'express'
import { dashborddata, Profile } from '../../controller/Dashboardcontroller.js'
import { authorization } from '../../middleware/Authorization.js'
const router = express.Router()

router.get('/data/dashboard',authorization,dashborddata)
router.get('/profile', authorization, Profile)

export default router