import express from 'express';
import uuid from 'uuid';

const router = express.Router();

const auctions = new Map();
const bids = new Map();
const users = new Map();

router.get('/auction/:id', (req, res) => {
  const { id } = req.params;
  const auction = auctions.get(id);
  if (auction) {
    res.status(200).json({ auction });
  } else {
    res.status(404).json({ error: `Auction ${id} not found` });
  }
});

router.post('/auction', (req, res) => {
  // TODO: implement
});

router.post('/auction/:id/bid', (req, res) => {
  // TODO: implement
});

router.post('/user', (req, res) => {
  // TODO: implement
});


export default router;
