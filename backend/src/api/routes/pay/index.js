import express from 'express'
import { router as vnpayRouter } from './vnpay.js'

const router = express.Router();

router.use('/vnpay', vnpayRouter);

export { router }