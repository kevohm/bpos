import express from 'express';
import { getAllUsers, getBranchUser, getIndividualUser, updateUser } from '../../controllers/UserOperations/UserOperations.js';

const userOperationsRoute = express.Router();

userOperationsRoute.get('/:business_id',getAllUsers);
userOperationsRoute.get('/branch_user/:branch_id',getBranchUser);
userOperationsRoute.get('/single_user/:user_id',getIndividualUser);
userOperationsRoute.put('/update_user/:user_id',updateUser);

export default userOperationsRoute;    