"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarQR = validarQR;
exports.buscarQRPorReserva = buscarQRPorReserva;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function validarQR(nombreArchivoQR) {
    const tempDir = path_1.default.join(__dirname, '..', 'temp');
    // Asegurarse de quitar la extensión si viene .png o .json
    const nombreBase = path_1.default.parse(nombreArchivoQR).name;
    const rutaJson = path_1.default.join(tempDir, `${nombreBase}.json`);
    if (!fs_1.default.existsSync(rutaJson)) {
        return {
            valido: false,
            errores: ['No se encontró codigo de Referencia QR válido.']
        };
    }
    try {
        const data = JSON.parse(fs_1.default.readFileSync(rutaJson, 'utf-8'));
        // Validar que tenga el comprobante dentro
        if (!data.referencia) {
            return {
                valido: false,
                errores: ['El archivo JSON no contiene un codigo de Referencia válido.']
            };
        }
        return {
            valido: true,
            referencia: data.referencia, // <- Aquí lo regresamos directamente
            datos: data // opcional, si quieres seguir usando monto y referencia también
        };
    }
    catch (err) {
        console.error('Error al leer el archivo JSON del QR:', err);
        return {
            valido: false,
            errores: ['Error al leer o parsear el archivo JSON.']
        };
    }
}
function buscarQRPorReserva(idReserva) {
    const tempDir = path_1.default.join(__dirname, '..', 'temp');
    const archivos = fs_1.default.readdirSync(tempDir).filter(file => file.endsWith('.json'));
    for (let archivo of archivos) {
        const rutaJson = path_1.default.join(tempDir, archivo);
        try {
            const contenido = JSON.parse(fs_1.default.readFileSync(rutaJson, 'utf-8'));
            if (contenido.idReserva === String(idReserva)) {
                const archivoQR = archivo.replace('.json', '.png');
                return {
                    encontrado: true,
                    archivoQR: archivoQR,
                    archivoJSON: archivo,
                    referencia: contenido.referencia
                };
            }
        }
        catch (error) {
            console.error('Error al leer o parsear el archivo JSON:', error);
        }
    }
    return {
        encontrado: false
    };
}
