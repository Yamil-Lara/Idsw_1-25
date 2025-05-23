import { Router, Request, Response } from 'express';
import { generarQR } from '../controllers/generarQRController';

const router = Router();

router.get('/generarQR/:monto', (req: Request, res: Response) => {
  generarQR(req, res);
});

export default router;
