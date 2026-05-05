const Crypto = require('../models/Crypto');

// @desc    Get all cryptocurrencies
// @route   GET /crypto
const getCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find({});
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top gainers
// @route   GET /crypto/gainers
const getGainers = async (req, res) => {
  try {
    // Sort by change24h in descending order (highest first)
    const cryptos = await Crypto.find({}).sort({ change24h: -1 });
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get new listings
// @route   GET /crypto/new
const getNewListings = async (req, res) => {
  try {
    // Sort by createdAt in descending order (newest first)
    const cryptos = await Crypto.find({}).sort({ createdAt: -1 });
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new cryptocurrency
// @route   POST /crypto
const addCrypto = async (req, res) => {
  const { name, symbol, price, image, change24h } = req.body;

  if (!name || !symbol || price === undefined || !image || change24h === undefined) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h,
    });

    res.status(201).json(crypto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCryptos,
  getGainers,
  getNewListings,
  addCrypto,
};
