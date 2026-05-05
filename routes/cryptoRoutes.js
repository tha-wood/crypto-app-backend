const express = require('express');
const router = express.Router();
const {
  getCryptos,
  getGainers,
  getNewListings,
  addCrypto,
} = require('../controllers/cryptoController');

router.route('/').get(getCryptos).post(addCrypto);
router.route('/gainers').get(getGainers);
router.route('/new').get(getNewListings);

module.exports = router;
