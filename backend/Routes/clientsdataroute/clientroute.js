import express from 'express'
import { createClientInfo, deleteClientInfo, getClientInfos } from '../../controller/clientdatacrntroller.js';
import {authorization} from '../../middleware/Authorization.js';

const router = express.Router();


router.post('/add-client', authorization,createClientInfo);
router.get('/get-clients', authorization, getClientInfos);
router.delete('/delete-client',authorization,deleteClientInfo)

export default router;
