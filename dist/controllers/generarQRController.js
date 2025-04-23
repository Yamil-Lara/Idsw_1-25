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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarQR = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pago_controller_1 = require("./pago.controller");
const validarQR_1 = require("./../middlewares/validarQR");
const generarQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tipo, monto, idReserva } = req.params;
        if (!monto) {
            return res.status(400).json({ error: 'Monto obligatorio para generar QR.' });
        }
        if (!idReserva) {
            return res.status(400).json({ error: 'idReserva obligatorio para generar QR.' });
        }
        if (!tipo || (tipo !== 'crear' && tipo !== 'regenerar')) {
            return res.status(400).json({ error: 'Debe especificar "crear" o "regenerar" en el tipo.' });
        }
        const reservaId = Number(idReserva);
        const tempDir = path_1.default.join(__dirname, '..', 'temp');
        const resultado = (0, validarQR_1.buscarQRPorReserva)(reservaId);
        // Si el tipo es "regenerar", eliminamos los archivos anteriores si existen
        if (tipo === 'regenerar' && resultado.encontrado) {
            const archivoQR = resultado.archivoQR;
            const archivoJSON = resultado.archivoJSON;
            if (archivoQR && archivoJSON) {
                const rutaAnteriorQR = path_1.default.join(tempDir, archivoQR);
                const rutaAnteriorJson = path_1.default.join(tempDir, archivoJSON);
                try {
                    if (fs_1.default.existsSync(rutaAnteriorJson))
                        fs_1.default.unlinkSync(rutaAnteriorJson);
                    if (fs_1.default.existsSync(rutaAnteriorQR))
                        fs_1.default.unlinkSync(rutaAnteriorQR);
                    console.log(`Archivos anteriores eliminados: ${rutaAnteriorQR}, ${rutaAnteriorJson}`);
                }
                catch (err) {
                    console.error('Error al eliminar archivos existentes:', err);
                }
            }
            else {
                console.warn('No se encontraron nombres de archivo para eliminar.');
            }
        }
        // Si se quiere crear y ya existe, no se debe generar nuevamente
        if (tipo === 'crear' && resultado.encontrado) {
            return res.json({
                mensaje: 'QR ya existente para esta reserva',
                archivoQR: resultado.archivoQR,
                archivoJSON: resultado.archivoJSON,
                referencia: resultado.referencia
            });
        }
        // Generamos nueva información de QR
        const referencia = 'QR-' + (0, pago_controller_1.generarCodigoComprobante)();
        const fecha = new Date().toISOString();
        const datos = {
            idReserva,
            referencia,
            monto,
            fecha
        };
        // Asegurar que el directorio temporal exista
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        // Generar nombre base único para los archivos
        const nombreBase = `qr_${Date.now()}`;
        const rutaJson = path_1.default.join(tempDir, `${nombreBase}.json`);
        const rutaQR = path_1.default.join(tempDir, `${nombreBase}.png`);
        // Guardar archivo JSON
        fs_1.default.writeFileSync(rutaJson, JSON.stringify(datos, null, 2), 'utf-8');
        // Contenido del QR que se generará
        const contenidoQR = `idReserva: ${idReserva}, Monto: ${monto}, Referencia: ${referencia}, Fecha: ${fecha}`;
        // Generar archivo QR en formato PNG
        yield qrcode_1.default.toFile(rutaQR, contenidoQR);
        // Programar eliminación de archivos temporales después de 10 minutos
        setTimeout(() => {
            try {
                if (fs_1.default.existsSync(rutaQR))
                    fs_1.default.unlinkSync(rutaQR);
                if (fs_1.default.existsSync(rutaJson))
                    fs_1.default.unlinkSync(rutaJson);
                console.log(`Archivos eliminados automáticamente: ${rutaQR}, ${rutaJson}`);
            }
            catch (err) {
                console.error('Error al eliminar archivos temporales:', err);
            }
        }, 10 * 60 * 1000); // 10 minutos
        // Respuesta exitosa
        return res.json({
            mensaje: 'QR generado correctamente',
            archivoQR: `${nombreBase}.png`,
            archivoJSON: `${nombreBase}.json`,
            referencia
        });
    }
    catch (error) {
        console.error('Error al generar QR:', error);
        return res.status(500).json({ error: 'Error interno al generar el QR.' });
    }
});
exports.generarQR = generarQR;
