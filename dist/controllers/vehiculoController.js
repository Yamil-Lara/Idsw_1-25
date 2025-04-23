"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehiculoConReserva = exports.getTopVehiculos = void 0;
const vehiculoService_1 = require("../services/vehiculoService");
const getTopVehiculos = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, vehiculoService_1.obtenerTopVehiculos)();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error al obtener los vehículos:', error);
        res.status(500).json({ error: 'Error al obtener los vehículos con mejor calificación' });
    }
});
exports.getTopVehiculos = getTopVehiculos;
const getVehiculoConReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const idvehiculo = parseInt(id);
        if (isNaN(idvehiculo)) {
            return res.status(400).json({ error: "ID de vehículo no válido" });
        }
        const vehiculoConReserva = yield (0, vehiculoService_1.obtenerVehiculoConReserva)(idvehiculo);
        res.status(200).json({
            success: true,
            data: vehiculoConReserva,
        });
    }
    catch (error) {
        console.error("Error al obtener el vehículo:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Error interno del servidor",
        });
    }
});
exports.getVehiculoConReserva = getVehiculoConReserva;
