"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const pago_routes_1 = __importDefault(require("./routes/pago.routes"));
const generarQRRoute_1 = __importDefault(require("./routes/generarQRRoute"));
const historialBusquedaRoutes_1 = __importDefault(require("./routes/historialBusquedaRoutes"));
const vehiculoRoutes_1 = __importDefault(require("./routes/vehiculoRoutes"));
const reservas_routes_1 = __importDefault(require("./routes/reservas.routes"));
const cors = require('cors');
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(cors());
app.use(express_1.default.json());
// Rutas de APIs
app.use('/pagos', pago_routes_1.default);
app.use('/', generarQRRoute_1.default);
app.use('/historial', historialBusquedaRoutes_1.default);
app.use('/vehiculo', vehiculoRoutes_1.default);
app.use('/reservas', reservas_routes_1.default);
app.use('/temp', express_1.default.static(path_1.default.join(process.cwd(), 'src', 'temp'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        }
    }
}));
app.use('/comprobante', express_1.default.static(path_1.default.join(process.cwd(), 'src', 'comprobante'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        }
    }
}));
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
