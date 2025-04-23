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
exports.verUltimasBusquedas = void 0;
const HistorialBusqueda_1 = require("../services/HistorialBusqueda");
const verUltimasBusquedas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const limite = req.query.limite ? parseInt(req.query.limite) : 10;
        if (isNaN(usuarioId)) {
            res.status(400).json({ error: 'ID de usuario inválido' });
            return;
        }
        const busquedas = yield (0, HistorialBusqueda_1.obtenerUltimasBusquedas)(usuarioId, limite);
        res.status(200).json(busquedas);
    }
    catch (error) {
        console.error('Error al obtener historial de búsqueda:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.verUltimasBusquedas = verUltimasBusquedas;
