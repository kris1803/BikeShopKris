var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51KjeyfDKE8PPQdZ15ZpsMHLZRaIyFLglTIigOqDtxqLPzKXBvYJWokgg8DnrTNQSPAh9Ak6a4WXKpelnBhR3wQvn002mn5hAKU')

let YOUR_DOMAIN = '';
let urlRead = false;
dataBike = [
  {name: 'BIK045',  url: 'images/bike-1.jpg', price: 679, priceid: 'price_1KjfPyDKE8PPQdZ127udQcVo', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam assumenda veritatis officiis atque consequuntur ducimus quasi neque, libero enim illum!' },
  {name: 'ZOOK07',  url: 'images/bike-2.jpg', price: 999, priceid:'price_1KjfQoDKE8PPQdZ1pwDqK4Gs', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam assumenda veritatis officiis atque consequuntur ducimus quasi neque, libero enim illum!' },
  {name: 'TITANS',  url: 'images/bike-3.jpg', price: 799, priceid:'price_1KjfRCDKE8PPQdZ1Au4ymdrX', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam assumenda veritatis officiis atque consequuntur ducimus quasi neque, libero enim illum!' },
  {name: 'CEWO',  url: 'images/bike-4.jpg', price: 1300, priceid: 'price_1KjfRSDKE8PPQdZ14OK1EIlk', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam assumenda veritatis officiis atque consequuntur ducimus quasi neque, libero enim illum!' },
  {name: 'AMIG39',  url: 'images/bike-5.jpg', price: 479, priceid: 'price_1KjfRpDKE8PPQdZ1TtVGx6BX', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam assumenda veritatis officiis atque consequuntur ducimus quasi neque, libero enim illum!' },
  {name: 'LIK099',  url: 'images/bike-6.jpg', price: 869, priceid: 'price_1KjfSVDKE8PPQdZ1TSvha7Ms', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam assumenda veritatis officiis atque consequuntur ducimus quasi neque, libero enim illum!' },
]

/* GET home page. */
router.get('/', function(req, res, next) {
  if (typeof req.session.dataCardBike === 'undefined') {
    req.session.dataCardBike = [];
  }
  //récuperer l'url complète une fois
  if (urlRead === false) {
    YOUR_DOMAIN = req.protocol + '://' + req.get('host');
    urlRead = true;
  }
  res.render('index', {bikes: dataBike});
});
// get basket page
router.get('/shop', function(req, res, next) {
  if (req.query.name) {
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
  const session = await stripe.checkout.sessions.create({
    line_items: sendData,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });
  console.log('New order! :')
  console.log(session);

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