import express from "express";
import { AddNewBranch, AddNewCompany, AddNewSchedule, AddNewUser } from "../controllers/CompanyRegistration.js";

const CompanyRegisterRouter = express.Router() 

CompanyRegisterRouter.post('/',AddNewCompany)
CompanyRegisterRouter.post ('/new_branch',AddNewBranch);
CompanyRegisterRouter.post('/user_registration',AddNewUser);
CompanyRegisterRouter.post('/company_schedules',AddNewSchedule);

export default CompanyRegisterRouter;
