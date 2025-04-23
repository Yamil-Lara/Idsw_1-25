"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historialBusquedaController_1 = require("../controllers/historialBusquedaController");
const router = (0, express_1.Router)();
router.get('/historial/:usuarioId', historialBusquedaController_1.verUltimasBusquedas);
exports.default = router;
