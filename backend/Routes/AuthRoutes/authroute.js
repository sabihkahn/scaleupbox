import express from 'express';
import {googleAuthmiddelware} from '../../middleware/googleResponse/verifygetpayload.js'
const router = express.Router();

import {googleAuth} from '../../controller/authcontroller.js'

// auth route for google authentication
router.post('/token/google', googleAuthmiddelware, googleAuth)





export default router;