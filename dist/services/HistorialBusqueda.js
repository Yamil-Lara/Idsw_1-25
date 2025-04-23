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
exports.obtenerUltimasBusquedas = void 0;
const database_1 = require("../config/database");
const obtenerUltimasBusquedas = (usuarioId_1, ...args_1) => __awaiter(void 0, [usuarioId_1, ...args_1], void 0, function* (usuarioId, limite = 10) {
    return yield database_1.prisma.historialBusqueda.findMany({
        where: {
            usuario_idusuario: usuarioId,
        },
        orderBy: {
            creado_en: 'desc',
        },
        take: limite,
    });
});
exports.obtenerUltimasBusquedas = obtenerUltimasBusquedas;
