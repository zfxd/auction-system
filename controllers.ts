import express from 'express';
import uuid from 'uuid';
import { Auction, Bid, User } from './types';

const router = express.Router();

// our 'database' (we'll be adding an actual database connection during the SQL workshop)
const auctions = new Map<string, Auction>();
const bids = new Map<string, Bid>();
const users = new Map<string, User>();

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
