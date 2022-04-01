var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51KjeyfDKE8PPQdZ15ZpsMHLZRaIyFLglTIigOqDtxqLPzKXBvYJWokgg8DnrTNQSPAh9Ak6a4WXKpelnBhR3wQvn002mn5hAKU')

const YOUR_DOMAIN = 'http://localhost:3000';

dataBike = [
  {name: 'BIK045',  url: 'images/bike-1.jpg', price: 679, priceid: 'price_1KjfPyDKE8PPQdZ127udQcVo'},
  {name: 'ZOOK07',  url: 'images/bike-2.jpg', price: 999, priceid:'price_1KjfQoDKE8PPQdZ1pwDqK4Gs'},
  {name: 'TITANS',  url: 'images/bike-3.jpg', price: 799, priceid:'price_1KjfRCDKE8PPQdZ1Au4ymdrX'},
  {name: 'CEWO',  url: 'images/bike-4.jpg', price: 1300, priceid: 'price_1KjfRSDKE8PPQdZ14OK1EIlk'},
  {name: 'AMIG39',  url: 'images/bike-5.jpg', price: 479, priceid: 'price_1KjfRpDKE8PPQdZ1TtVGx6BX'},
  {name: 'LIK099',  url: 'images/bike-6.jpg', price: 869, priceid: 'price_1KjfSVDKE8PPQdZ1TSvha7Ms'},
]

/* GET home page. */
router.get('/', function(req, res, next) {
  if (typeof req.session.dataCardBike === 'undefined') {
    req.session.dataCardBike = [];
  }
  res.render('index', {bikes: dataBike});
});
// get basket page
router.get('/shop', function(req, res, next) {
  var found = false;
  var qty = parseInt(req.query.qty);
  req.session.dataCardBike.forEach(element => {
    if(req.query.name === element.name) {
      element.qty += 1;
      found = true;
    }
  });
  if (found === false) {
    req.session.dataCardBike.push({ name: req.query.name , url:req.query.url, qty: qty, price: req.query.price, priceid:req.query.priceid });
  }
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});
// delete item from basket
router.get('/delete-shop', function(req, res) {
  req.session.dataCardBike.splice(req.query.id, 1);
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});
// update quantity
router.post('/update-shop', function(req, res) {
  var id = req.body.id;
  var qty = req.body.qty;
  req.session.dataCardBike[id].qty = qty;
  res.render('shop', {dataCardBike: req.session.dataCardBike});
})
// stripe redirection
router.post('/create-checkout-session', async (req, res) => {
  let sendData = [];
  for (let i = 0; i <req.session.dataCardBike.length; i++) {
    sendData.push({ price: req.session.dataCardBike[i].priceid, quantity: req.session.dataCardBike[i].qty});
  }
  console.log(sendData);
  const session = await stripe.checkout.sessions.create({
    line_items: sendData,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });

  res.redirect(303, session.url);
});
router.get('/success', function(req, res) {
  dataCardBike = [];
  res.render('success', {});
})
router.get('/cancel', function(req, res) {
  dataCardBike = [];
  res.render('cancel', {});
})

module.exports = router;