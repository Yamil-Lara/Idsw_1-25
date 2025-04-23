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
exports.obtenerPagos = exports.registrarPago = void 0;
const database_1 = require("../config/database");
const registrarPago = (reserva_idreserva, monto, metodo_pago, referencia, concepto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservaExistente = yield database_1.prisma.reserva.findUnique({
            where: { idreserva: reserva_idreserva },
        });
        if (!reservaExistente) {
            throw new Error('La reserva no existe');
        }
        const nuevoPago = yield database_1.prisma.pago.create({
            data: {
                reserva_idreserva,
                monto,
                metodo_pago,
                referencia,
                detalles: {
                    create: {
                        concepto,
                        monto
                    }
                }
            },
            include: {
                detalles: true
            }
        });
        return nuevoPago;
    }
    catch (error) {
        console.error('Error al crear el pago:', error);
        throw new Error('Error al crear el pago');
    }
});
exports.registrarPago = registrarPago;
const obtenerPagos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield database_1.prisma.pago.findMany();
    }
    catch (error) {
        console.error('Error al obtener los pagos:', error);
        throw new Error('Error al obtener los pagos');
    }
});
exports.obtenerPagos = obtenerPagos;
