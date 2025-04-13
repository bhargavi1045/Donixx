import { Router } from "express";
import { HospitalController } from "../controllers/hospital.controller";
export class HospitalRoute{
    static hospitalRoute(){
        const router= Router();
        router.route("/staff-management").post(HospitalController.addstaff).get(HospitalController.getStaffs).put(HospitalController.editStaff).delete(HospitalController.deleteStaff);
        router.route("/patient-management").post(HospitalController.addNPatient)
        return router;
    }
}