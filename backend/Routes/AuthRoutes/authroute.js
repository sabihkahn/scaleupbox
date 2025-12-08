import express from 'express';
import {googleAuthmiddelware} from '../../middleware/googleResponse/verifygetpayload.js'
const router = express.Router();

import {googleAuth, registerauth,loginauth,logout,refreshToken, otpsender, verifyotp, resetpassword} from '../../controller/authcontroller.js'

// auth route for google authentication
router.post('/token/google', googleAuthmiddelware, googleAuth)
router.post('/token/refresh', refreshToken)
router.post('/user/register',registerauth)
router.post('/user/login',loginauth)
router.post('/user/logout',logout)
router.post('/user/getotp',otpsender)
router.post('/user/verifyotp',verifyotp)
router.post('/user/resetpass',resetpassword)

export default router;