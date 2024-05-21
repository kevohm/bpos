import express from 'express';
import { AddBranch, BusinessRegistration, LoginBranches, Member, StaffMembers, deleteuser, login, logout, register, updateUser, updateUserEndShift, updateUserStartShift } from '../controllers/Auth.js';

const authRoute = express.Router()

authRoute.post("/register", register);
authRoute.post("/login", login); 
authRoute.post("/logout", logout);
authRoute.get("/allmembers/:company_id",StaffMembers); 
authRoute.get("/staffmembers/:id",Member);
authRoute.post("/addBusiness",BusinessRegistration); 
authRoute.put('/updateUser/:id',updateUser); 
authRoute.delete('/staffmembers/:id',deleteuser);
authRoute.post('/branches',AddBranch);
authRoute.get('/loginbranches',LoginBranches)
authRoute.put('/updateUserStartShift/:id',updateUserStartShift)
authRoute.put('/updateUserEndShift/:id',updateUserEndShift)

export default authRoute;