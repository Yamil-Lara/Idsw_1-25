"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehiculoController_1 = require("../controllers/vehiculoController");
const router = (0, express_1.Router)();
router.get('/obtenerVehiculosTop', vehiculoController_1.getTopVehiculos);
router.get("/obtenerDetalleVehiculo/:id", vehiculoController_1.getVehiculoConReserva);
exports.default = router; // ✅ debe exportar un router
