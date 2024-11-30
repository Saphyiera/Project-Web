import { router as productRouter} from './product.js'
import { router as userRouter} from './user.js'
import { router as brandRouter } from './brand.js';
import { router as orderRouter} from './order.js';
import { router as cartRouter} from './cart.js';
import { router as addressRouter } from './address.js';
import { router as payRouter } from './pay/index.js';

function route(app) {
    app.use('/product', productRouter);
    app.use('/user', userRouter);
    app.use('/cart', cartRouter)
    app.use('/brand', brandRouter);
    app.use('/order', orderRouter);
    app.use('/address', addressRouter);
    app.use('/pay', payRouter)
}

export { route };