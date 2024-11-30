import express from 'express'
import crypto from 'crypto'
import querystring from 'qs'
import moment from 'moment'
import axios from 'axios'
import OrderModel from '../../../db/model/Order.js';

const router = express.Router();

const vnp_TmnCode = "N503GXRD";
const vnp_HashSecret = "Q4KHLNJCZC3P7GS3YQH7POP2RFUQ9JZS";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:4000/pay/vnpay/vnpay_return";

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// API for Creating Payment URL (Input includes orderId, backcode and totalCost as amount)
router.post('/create_payment_url', function (req, res, next) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = vnp_TmnCode;
    let secretKey = vnp_HashSecret;
    let vnpUrl = vnp_Url;
    let returnUrl = vnp_ReturnUrl;

    var date = new Date();

    var createDate = moment(date).format('YYYYMMDDHHmmss');
    var orderId = req.body.orderId;
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    
    var orderInfo = `Thanh toan hoa don ${orderId}. Thoi gian: ${moment(date).format('YYYY-MM-DD HH:mm:ss')}`;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if(!locale || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({redirectUrl: vnpUrl});
});

// API for Getting payment result and Update payment_status to db
router.get('/vnpay_ipn', async (req, res, next) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = vnp_HashSecret;
    var signData = querystring.stringify(vnp_Params, { encode: false });     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
        

    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        var amount = vnp_Params['vnp_Amount'] / 100;
        // Kiểm tra dữ liệu có hợp lệ không, cập nhật trạng thái đơn hàng và gửi kết quả cho VNPAY theo định dạng dưới
        try {
            //Lấy thông tin đơn hàng lưu trong Database và kiểm tra trạng thái của đơn hàng, mã đơn hàng là: $orderId            
            //Việc kiểm tra trạng thái của đơn hàng giúp hệ thống không xử lý trùng lặp, xử lý nhiều lần một giao dịch
            let order = await OrderModel.findById(orderId);
            if (order) {
                let total = 0;
                order.products.forEach(product => {
                    total += product.new_price * product.quantity;
                })
                if (total === amount) {                  //Kiểm tra số tiền thanh toán của giao dịch
                    if (order.payment_status == 0) {    
                        if (rspCode == 0) {
                            await OrderModel.findOneAndUpdate({_id: orderId}, {payment_status: 1});   // Trạng thái thanh toán thành công
                        } else {
                            await OrderModel.findOneAndUpdate({_id: orderId}, {payment_status: 2});   // Trạng thái thanh toán thất bại / lỗi
                        }
                        res.status(200).json({RspCode: '00', Message: 'Confirm Success'})
                    } else {
                        res.status(200).json({RspCode: '02', Message: 'Order already confirmed'})
                    }
                } else {
                    res.status(200).json({RspCode: '04', Message: 'Invalid Amount'})
                }
            } else {
                res.status(200).json({RspCode: '01', Message: 'Order not Found'})
            }
        } catch (error) {
            console.log(error);
            res.status(200).json({RspCode: '99', Message: 'Unknow error'})
        }
    } else {
        res.status(200).json({RspCode: '97', Message: 'Invalid Checksum'})
    }
});

router.get('/vnpay_return', async (req, res, next) => {
    var vnp_Params = req.query;

    try {
        const response = await axios.get(
            `http://localhost:4000/pay/vnpay/vnpay_ipn?${querystring.stringify(vnp_Params, { encode: false })}`
        )

        if (response.data.RspCode !== '00') {
            return res.render('error', {
                status: response.data.Message
            })
        }
    } catch (error) {
        console.log(error);
        res.render('error', {
            status: 'Failed',
        });
    }

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var tmnCode = vnp_TmnCode;
    var secretKey = vnp_HashSecret;

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        var rspCode = vnp_Params['vnp_ResponseCode'];
        var amount = vnp_Params['vnp_Amount'] / 100;
        var transactionNo = vnp_Params['vnp_TransactionNo']
        var transactionStatus = vnp_Params['vnp_TransactionStatus'];
        var bankCode = vnp_Params['vnp_BankCode'];
        var cardType = vnp_Params['vnp_CardType'];
        var orderInfo = Object.keys(querystring.parse(vnp_Params['vnp_OrderInfo']));
        if (rspCode === "00" && transactionStatus === "00") {
            res.render('success', {
                transactionNo: transactionNo,
                cardType: cardType,
                bankCode: bankCode,
                orderInfo: orderInfo,
                amount: amount,
                status: 'Success'
            });
        } else {
            res.render('error', {
                status: 'Failed',
            });
        }
    } else{
        res.render('error', {
            status: 'Invalid checksum',
        });
    }
});

export { router };
