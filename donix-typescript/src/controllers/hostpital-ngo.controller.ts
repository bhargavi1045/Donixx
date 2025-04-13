import { Request, Response } from "express";
import { Hospital } from "../models/hospitalModel";
import { NGO } from "../models/ngoModels";
import { Notification } from "../models/notificationModel";
import connectDatabase from "../config/db";

export class HospitalNGOController {
    static async addHospital(req: Request, res: Response): Promise<void> {
        try {
            const { name, location, contactNumber, adminUser, specialization, servicesOffered, emergencyContact, website, establishedYear } = req.body;

            if (!name || !location || !contactNumber || !specialization || !servicesOffered || !emergencyContact) {
                res.status(400).json({ error: "All required fields must be filled!" });
                return;
            }

            const newHospital = await Hospital.create({ name, location, contactNumber, adminUser, specialization, servicesOffered, emergencyContact, website, establishedYear });

            const notification = await Notification.create({
                message: `New hospital added: ${newHospital.name}`,
                title: "New Hospital Registration",
                type: "General",
                forAll: true,
                isRead: false,
            });

            res.status(201).json(newHospital);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    static async addNGO(req: Request, res: Response): Promise<void> {
        try {
            const { name, mission, location, contactNumber, email, areasOfWork, totalVolunteers, website, establishedYear } = req.body;

            if (!name || !mission || !location || !contactNumber || !email || !areasOfWork || totalVolunteers === undefined) {
                res.status(400).json({ error: "All required fields must be filled!" });
                return;
            }

            const newNGO = await NGO.create({ name, mission, location, contactNumber, email, areasOfWork, totalVolunteers, website, establishedYear });

            const notification = await Notification.create({
                message: `New NGO added: ${newNGO.name}`,
                title: "New NGO Registration",
                type: "General",
                forAll: true,
                isRead: false,
            });

            res.status(201).json(newNGO);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    static async getHospitals(req: Request, res: Response): Promise<void> {
        try {
            await connectDatabase()
            const hospitals = await Hospital.find();
            res.status(200).json(hospitals);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getNGOs(req: Request, res: Response): Promise<void> {
        try {
            const ngos = await NGO.find();
            res.status(200).json(ngos);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getHospitalById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                res.status(404).json({ error: "Hospital not found" });
                return;
            }
            res.status(200).json(hospital);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getNGOById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const ngo = await NGO.findById(id);
            if (!ngo) {
                res.status(404).json({ error: "NGO not found" });
                return;
            }
            res.status(200).json(ngo);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async updateHospital(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedHospital = await Hospital.findByIdAndUpdate(id, req.body, { new: true });

            if (!updatedHospital) {
                res.status(404).json({ error: "Hospital not found" });
                return;
            }

            res.status(200).json(updatedHospital);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async updateNGO(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedNGO = await NGO.findByIdAndUpdate(id, req.body, { new: true });

            if (!updatedNGO) {
                res.status(404).json({ error: "NGO not found" });
                return;
            }

            res.status(200).json(updatedNGO);
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async deleteHospital(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedHospital = await Hospital.findByIdAndDelete(id);

            if (!deletedHospital) {
                res.status(404).json({ error: "Hospital not found" });
                return;
            }

            res.status(200).json({ message: "Hospital deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async deleteNGO(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedNGO = await NGO.findByIdAndDelete(id);

            if (!deletedNGO) {
                res.status(404).json({ error: "NGO not found" });
                return;
            }

            res.status(200).json({ message: "NGO deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getStatistics(req: Request, res: Response): Promise<void> {
        try {
            const hospitalCount = await Hospital.countDocuments();
            const ngoCount = await NGO.countDocuments();

            res.status(200).json({ hospitals: hospitalCount, ngos: ngoCount });
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
