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
exports.generarImagenPago = void 0;
const canvas_1 = require("canvas");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const generarImagenPago = (pago) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const width = 800;
    const height = 1100;
    const canvas = (0, canvas_1.createCanvas)(width, height);
    const ctx = canvas.getContext('2d');
    // Colores y fuentes
    const colorPrimario = '#ff7f00';
    const colorSecundario = '#0077ff';
    const gris = '#333333';
    // Fondo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    // Encabezado con fondo
    ctx.fillStyle = colorPrimario;
    ctx.fillRect(0, 0, width, 100);
    // Título
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('🧾 Comprobante de Pago', 20, 60);
    // Logo (opcional)
    try {
        const logoPath = path_1.default.join(__dirname, 'logo.png');
        if (fs_1.default.existsSync(logoPath)) {
            const logo = yield (0, canvas_1.loadImage)(logoPath);
            ctx.drawImage(logo, width - 130, 10, 100, 80);
        }
    }
    catch (e) {
        console.warn('Logo no disponible:', e);
    }
    // Línea separadora
    ctx.strokeStyle = colorSecundario;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 110);
    ctx.lineTo(width - 20, 110);
    ctx.stroke();
    // Detalles del pago
    ctx.fillStyle = gris;
    ctx.font = '20px Arial';
    const fecha = new Date().toLocaleString();
    const detalles = [
        `📆 Fecha: ${fecha}`,
        `💳 Método de pago: ${pago.metodo_pago}`,
        `💲 Monto: Bs. ${pago.monto}`,
        `🔗 Referencia: ${pago.referencia || 'N/A'}`,
        `📌 Concepto: ${((_a = pago.detalles) === null || _a === void 0 ? void 0 : _a.concepto) || 'Pago de reserva'}`,
        `✅ Estado: PAGADO`,
    ];
    let y = 150;
    for (const texto of detalles) {
        ctx.fillText(texto, 40, y);
        y += 40;
    }
    // Pie
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.fillText('Gracias por su pago. Conserve este comprobante.', 40, height - 40);
    // Guardar imagen
    const tempDir = path_1.default.join(__dirname, '..', 'comprobante');
    if (!fs_1.default.existsSync(tempDir))
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    const filename = `pago_${Date.now()}.png`;
    const imagePath = path_1.default.join(tempDir, filename);
    const buffer = canvas.toBuffer('image/png');
    fs_1.default.writeFileSync(imagePath, buffer);
    // Eliminar después de 10 minutos
    setTimeout(() => {
        fs_1.default.unlink(imagePath, (err) => {
            if (err)
                console.error(`Error al eliminar comprobante: ${filename}`, err);
            else
                console.log(`Comprobante eliminado: ${filename}`);
        });
    }, 10 * 60 * 1000);
    return imagePath;
});
exports.generarImagenPago = generarImagenPago;
