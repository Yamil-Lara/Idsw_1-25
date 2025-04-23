"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.generarCodigoComprobante = exports.obtenerPagos = exports.realizarPagoTarjeta = exports.registrarPago = exports.realizarPagoQR = void 0;
const PagoService = __importStar(require("../services/pago.service"));
const mailer_1 = require("../utils/mailer");
const generarImagen_1 = require("../utils/generarImagen");
const client_1 = require("@prisma/client");
const validarTarjeta_1 = require("../middlewares/validarTarjeta");
const validarQR_1 = require("../middlewares/validarQR");
const realizarPagoQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reserva_idreserva } = req.params;
        const { nombreArchivoQR, monto, concepto, correoElectronico } = req.body;
        const metodo = "QR";
        // Validación de campos
        if (!nombreArchivoQR || !monto || !reserva_idreserva || !concepto || !correoElectronico) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }
        // Validación del QR
        const referenciaValidada = (0, validarQR_1.validarQR)(nombreArchivoQR);
        if (!referenciaValidada.valido) {
            return res.status(400).json({ error: referenciaValidada.errores });
        }
        const codigoReferencia = referenciaValidada.referencia;
        const metodoPago = client_1.MetodoPago.QR;
        // Conversión de datos
        const montoNum = parseFloat(monto);
        const idReservaNumerico = parseInt(reserva_idreserva, 10);
        if (isNaN(montoNum) || montoNum <= 0) {
            return res.status(400).json({ error: 'El monto debe ser un número válido mayor que cero.' });
        }
        if (isNaN(idReservaNumerico)) {
            return res.status(400).json({ error: 'El ID de la reserva debe ser un número válido.' });
        }
        // Registro del pago
        const resultadoPago = yield (0, exports.registrarPago)(correoElectronico, idReservaNumerico, montoNum, // ← aquí pasamos el número
        metodoPago, codigoReferencia, concepto);
        if (resultadoPago.error) {
            return res.status(400).json({ error: resultadoPago.error });
        }
        // Respuesta exitosa
        return res.json({
            mensaje: 'Pago QR registrado correctamente.',
            pago: resultadoPago.pago,
            imagen: resultadoPago.imagen
        });
    }
    catch (error) {
        console.error('Error al registrar pago QR:', error);
        return res.status(500).json({ error: 'Error interno al procesar el pago.' });
    }
});
exports.realizarPagoQR = realizarPagoQR;
const registrarPago = (correo, reserva_idreserva, monto, metodo_pago, referencia, concepto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!correo)
            return { error: 'El correo es obligatorio' };
        if (!reserva_idreserva || isNaN(reserva_idreserva))
            return { error: 'El ID de la reserva es obligatorio y debe ser un número' };
        if (monto <= 0)
            return { error: 'El monto debe ser mayor a cero' };
        if (!referencia)
            return { error: 'La referencia es obligatoria' };
        if (!concepto)
            return { error: 'El concepto del pago es obligatorio' };
        const nuevoPago = yield PagoService.registrarPago(reserva_idreserva, monto, metodo_pago, referencia, concepto);
        const imagePath = yield (0, generarImagen_1.generarImagenPago)(nuevoPago);
        const correoHtml = `
      <h2>Confirmación de Pago</h2>
      <p>Gracias por su pago. Aquí están los detalles:</p>
      <ul>
        <li>Método: ${metodo_pago}</li>
        <li>Monto: $${monto}</li>
        <li>Referencia: ${referencia}</li>
        <li>Concepto: ${concepto}</li>
      </ul>
    `;
        const exito = yield (0, mailer_1.sendEmail)(correo, 'Confirmación de Pago - RediBo', correoHtml, imagePath);
        if (!exito)
            throw new Error('Error al enviar el correo');
        return {
            message: 'Pago y detalle registrados correctamente',
            pago: nuevoPago,
            imagen: imagePath
        };
    }
    catch (error) {
        console.error('Error al registrar el pago:', error);
        return { error: 'Error interno al registrar el pago' };
    }
});
exports.registrarPago = registrarPago;
const realizarPagoTarjeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reserva_idreserva } = req.params;
        const { monto, concepto, nombreTitular, numeroTarjeta, fechaExpiracion, cvv, direccion, correoElectronico } = req.body;
        const metodo = "TARJETA DÉBITO";
        const { valido, errores } = (0, validarTarjeta_1.validarTarjeta)(nombreTitular, numeroTarjeta, fechaExpiracion, cvv, direccion, correoElectronico);
        if (!valido) {
            return res.status(400).json({ error: 'Errores en la validación de la tarjeta', detalles: errores });
        }
        const montoNum = parseFloat(monto);
        const reservaIdNum = parseInt(reserva_idreserva, 10);
        if (isNaN(montoNum) || isNaN(reservaIdNum)) {
            return res.status(400).json({ error: 'El monto o el ID de reserva no son válidos.' });
        }
        const metodoPago = client_1.MetodoPago.TARJETA_DEBITO;
        const referencia = 'TC-' + (0, exports.generarCodigoComprobante)();
        const resultado = yield (0, exports.registrarPago)(correoElectronico, reservaIdNum, montoNum, metodoPago, referencia, concepto);
        if (resultado.error) {
            return res.status(500).json({ error: resultado.error });
        }
        return res.status(200).json({
            mensaje: 'Pago con tarjeta registrado correctamente.',
            pago: resultado.pago,
            imagen: resultado.imagen
        });
    }
    catch (error) {
        console.error('Error al registrar pago con tarjeta:', error);
        return res.status(500).json({ error: 'Error interno al procesar el pago.' });
    }
});
exports.realizarPagoTarjeta = realizarPagoTarjeta;
const obtenerPagos = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagos = yield PagoService.obtenerPagos();
        res.json(pagos);
    }
    catch (error) {
        console.error('Error al obtener los pagos:', error);
        res.status(500).json({ error: 'Error al obtener los pagos' });
    }
});
exports.obtenerPagos = obtenerPagos;
// Función para generar un código de comprobante aleatorio
const generarCodigoComprobante = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let comprobante = '';
    for (let i = 0; i < 12; i++) {
        comprobante += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return comprobante;
};
exports.generarCodigoComprobante = generarCodigoComprobante;
