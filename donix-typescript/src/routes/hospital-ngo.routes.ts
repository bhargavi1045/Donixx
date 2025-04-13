import { Router } from "express";
import { HospitalNGOController } from "../controllers/hostpital-ngo.controller";

export class hospitalNGORoute {
    static hospitalNGORoute() {
        const router = Router();
        router.route("/hospitals").post(HospitalNGOController.addHospital).get(HospitalNGOController.getHospitals);
        router.route("/ngos").post(HospitalNGOController.addNGO).get(HospitalNGOController.getNGOs);
        router.route("/hospitals/:id").get(HospitalNGOController.getHospitalById).put(HospitalNGOController.updateHospital).delete(HospitalNGOController.deleteHospital);
        router.route("/ngos/:id").get(HospitalNGOController.getNGOById).put(HospitalNGOController.updateNGO).delete(HospitalNGOController.deleteNGO);
        router.route("/statistics").get(HospitalNGOController.getStatistics);

        return router;
    }
}
