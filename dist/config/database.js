"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
//C:\Users\H P\Documents\IS 2025\PROYECTO IS 1_2025\RediBo_Back\src\config\database.ts
/*
Vista rápida del funcionamiento y contenido de esta carpeta

    Archivos de configuración del proyecto
        - Conexión a la base de datos
        - Configuración de variables de entorno, servicios externos y/o opciones del servidor
*/
/*
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
*/
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
