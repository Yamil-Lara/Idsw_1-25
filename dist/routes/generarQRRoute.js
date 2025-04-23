"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generarQRController_1 = require("../controllers/generarQRController");
const router = (0, express_1.Router)();
router.get('/generarQR/:tipo/:monto/:idReserva', (req, res) => {
    (0, generarQRController_1.generarQR)(req, res);
});
exports.default = router;
