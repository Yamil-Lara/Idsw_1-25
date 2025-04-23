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
exports.obtenerVehiculoConReserva = exports.obtenerTopVehiculos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Devuelve los 5 vehículos con mejor promedio de calificaciones
const obtenerTopVehiculos = () => __awaiter(void 0, void 0, void 0, function* () {
    const resultado = yield prisma.vehiculo.findMany({
        select: {
            idvehiculo: true,
            marca: true,
            imagen: true,
            placa: true,
            descripcion: true,
            modelo: true,
            tarifa: true,
            color: true,
            calificaciones: {
                select: {
                    puntuacion: true,
                },
            },
        },
    });
    const vehiculosConPromedio = resultado
        .map((vehiculo) => {
        const total = vehiculo.calificaciones.reduce((acc, val) => acc + val.puntuacion, 0);
        const cantidad = vehiculo.calificaciones.length;
        const promedio = cantidad > 0 ? parseFloat((total / cantidad).toFixed(2)) : 0;
        return {
            idvehiculo: vehiculo.idvehiculo,
            imagen: vehiculo.imagen,
            placa: vehiculo.placa,
            descripcion: vehiculo.descripcion,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            tarifa: vehiculo.tarifa,
            color: vehiculo.color,
            promedio_calificacion: promedio,
        };
    })
        .sort((a, b) => b.promedio_calificacion - a.promedio_calificacion)
        .slice(0, 5);
    return vehiculosConPromedio;
});
exports.obtenerTopVehiculos = obtenerTopVehiculos;
// Devuelve los detalles de un vehículo con su última reserva
const obtenerVehiculoConReserva = (idvehiculo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vehiculo = yield prisma.vehiculo.findUnique({
        where: { idvehiculo },
        select: {
            idvehiculo: true,
            imagen: true,
            placa: true,
            descripcion: true,
            marca: true,
            modelo: true,
            tarifa: true,
            reservas: {
                orderBy: { fecha_creacion: 'desc' },
                take: 1,
                select: {
                    fecha_inicio: true,
                    fecha_fin: true,
                    idreserva: true,
                    estado: true,
                    pagado: true,
                },
            },
        },
    });
    if (!vehiculo) {
        throw new Error('Vehículo no encontrado');
    }
    return {
        idvehiculo: vehiculo.idvehiculo,
        imagen: vehiculo.imagen,
        placa: vehiculo.placa,
        descripcion: vehiculo.descripcion,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        tarifa: vehiculo.tarifa,
        incluido_en_reserva: vehiculo.reservas.length > 0,
        reserva: (_a = vehiculo.reservas[0]) !== null && _a !== void 0 ? _a : null,
    };
});
exports.obtenerVehiculoConReserva = obtenerVehiculoConReserva;
