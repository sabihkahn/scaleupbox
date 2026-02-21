import express from 'express'
import { dashborddata, Profile, updateProfile } from '../../controller/Dashboardcontroller.js'
import { authorization } from '../../middleware/Authorization.js'
const router = express.Router()

router.get('/data/dashboard',authorization,dashborddata)
router.get('/profile', authorization, Profile)
router.put('/updateProfile',authorization,updateProfile)

export default router