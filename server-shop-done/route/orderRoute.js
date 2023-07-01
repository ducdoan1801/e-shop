const express = require('express')
const router = express.Router()
const Order = require('../modal/Order')
const dateFormat = require('dateformat');
const querystring = require('qs');
const crypto = require('crypto');

router.post("/addOrder", async (req, res) => {
    try {
        let order = new Order({
            userID: req.body.userID,
            userName: req.body.userName,
            position: req.body.position,
            phoneNumber: req.body.phoneNumber,
            payType: req.body.payType,
            total: req.body.total,
            state: req.body.state,
            description: req.body.description,
            Address: req.body.Address,
            ListProductId: req.body.ListProductId,
            ListProductImg: req.body.ListProductImg,
            ListProductName: req.body.ListProductName,
            ListProductTotal: req.body.ListProductTotal,
            ListProductColor: req.body.ListProductColor,
            quantityProduct: req.body.quantityProduct,
        });

        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        console.log(err);
    }
});

// get all by id====================================
router.post('/', async (req, res) => {
    try {
        let orders = await Order.find({ userID: req.body.userID })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get orders server error' })
    }
})

// get all 
router.get('/', async (req, res) => {
    try {
        let orders = await Order.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get orders server error' })
    }
})
router.post(
    '/create_payment_url',
    (req, res, next) =>{
        let ipAddr =
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
    
        let vnpUrl = process.env.VNP_URL;
        const date = new Date();
        const createDate = dateFormat(date, 'yyyymmddHHmmss');
        let orderId = dateFormat(date, 'HHmmss');
        let amount = req.body.amount;
        let locale = 'vn';
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = process.env.VNP_TMN_CODE;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toán hóa đơn';
        vnp_Params['vnp_OrderType'] = 'billpayment';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = process.env.VNP_RETURN_URL;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_BankCode'] = 'NCB';
    
        const secretKey = process.env.VNP_HASH_SECRET;
        vnp_Params = sortObject(vnp_Params);
        var signData = querystring.stringify(vnp_Params, { encode: false });
    
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        const query = '?' + querystring.stringify(vnp_Params, { encode: false });
        vnpUrl += query;
    
        res.status(200).json({ code: '00', data: vnpUrl, query });
      }
  );

// Update ==================================================================================
router.put("/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);

        const data = {
            _id: order._id,
            userID: order.userID,
            userName: order.userName,
            position: order.position,
            Address: order.Address,
            phoneNumber: order.phoneNumber,
            payType: order.payType,
            total: order.total,
            state: req.body.state,
            description: order.description,
            ListProductId: order.ListProductId,
            ListProductImg: order.ListProductImg,
            ListProductName: order.ListProductName,
            ListProductTotal: order.ListProductTotal,
            ListProductColor: order.ListProductColor,
            quantityProduct: order.quantityProduct,
        };

        order = await Order.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json({ message: 'success', success: true, order: data });
    } catch (err) {
        console.log(err);
    }
});



router.delete("/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        await order.remove();
        res.json({ message: 'success', success: true, order });
    } catch (err) {
        console.log(err);
    }
});
function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

module.exports = router