import { NextFunction } from "express";
import { Request,Response } from "express";
import hospitalStaffModel from "../models/hospitalStaff.model";
import connectDatabase from "../config/db";
import PatientReminder from "../models/patientReminder.model";
import { NPatientModel } from "../models/NPatient.model";
export class HospitalController{
    static async getStaffs(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const { hospitalId } = req.query;
            await connectDatabase()
            const hospitalObjectId = hospitalId;
            console.log(hospitalId,'adk;afd')
            const staffs = await hospitalStaffModel.find({ hospital: hospitalObjectId })
                .select("name role email department assignedRoles");

            res.status(200).json(staffs);
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    static async addstaff(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const { hospital, name, email, role, department, assignedRoles } = req.body;
            
            await connectDatabase();

            const newStaff = new hospitalStaffModel({
                hospital: hospital,
                name,
                email,
                role,
                department,
                assignedRoles: assignedRoles || []
            });

            const savedStaff = await newStaff.save();

            res.status(201).json({ message: "Staff added successfully", staff: savedStaff });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async editStaff(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { staffId } = req.query;
            const { name, email, role, department, assignedRoles } = req.body;
            await connectDatabase();

            const updatedStaff = await hospitalStaffModel.findByIdAndUpdate(
                staffId,
                { name, email, role, department, assignedRoles },
                { new: true, runValidators: true }
            );

            if (!updatedStaff) {
                res.status(404).json({ message: "Staff not found" });
                return;
            }

            res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteStaff(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { staffId } = req.query;
            await connectDatabase();
            const deletedStaff = await hospitalStaffModel.findByIdAndDelete(staffId);

            if (!deletedStaff) {
                res.status(404).json({ message: "Staff not found" });
                return;
            }

            res.status(200).json({ message: "Staff deleted successfully" });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async createReminder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { patient, doctor, dateTime, type, notes, reminderSettings, notificationMethods, hospitalRef } = req.body;

            await connectDatabase();

            const newReminder = new PatientReminder({
                patient,
                doctor,
                dateTime,
                type,
                notes,
                reminderSettings,
                notificationMethods,
                hospitalRef,
                isScheduled: true
            });

            const savedReminder = await newReminder.save();

            res.status(201).json({ message: "Reminder created successfully", reminder: savedReminder });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getRemindersByHospital(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { hospitalId } = req.params;

            await connectDatabase();

            const reminders = await PatientReminder.find({ hospitalRef: hospitalId });

            res.status(200).json(reminders);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async addNPatient(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { date, doctor, notes, patient, type } = req.body;

            await connectDatabase();

            const newNPatient = new NPatientModel({
                date,
                doctor,
                notes,
                patient,
                type
            });

            const savedNPatient = await newNPatient.save();

            res.status(201).json({ message: "NPatient added successfully", npatient: savedNPatient });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getPatient(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{

        }catch(e){
            res.status(500).json({messaage:"Internal Server Error"})
        }
    }
}