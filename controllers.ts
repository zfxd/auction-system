import express from 'express';
import uuid from 'uuid';
import { Auction, Bid, User } from './types';

const router = express.Router();

// our 'database' (we'll be adding an actual database connection during the SQL workshop)
const auctions = new Map<string, Auction>();
const bids = new Map<string, Bid>();
const users = new Map<string, User>();

router.get('/auction/:id', (req, res) => {
  const id: string = req.params.id;
  const auction = auctions.get(id);
  if (auction) {
    res.status(200).json({ auction });
  } else {
    res.status(404).json({ error: `Auction ${id} not found` });
  }
});

router.post('/auction', (req, res) => {
  const auction: Auction = req.body.auction;

  const id = uuid.v4();
  auction.id = id;
  auctions.set(id, auction);
  res.status(200).json({ auction });
});

router.post('/auction/:id/bid', (req, res) => {
  const auctionId: string = req.params.id;
  const auction = auctions.get(auctionId);
  // check if auction id is valid
  if (!auction) {
    res.status(404).json({ error: `Auction ${auctionId} not found` });
  }
  // check if auction hasn't ended
  if (new Date() > auction.end) {
    res.status(400).json({ error: `Auction ${auctionId} has already ended!` });
  }

  const bid: Bid = req.body.bid;
  const bidderId = bid.bidder;
  const user = users.get(bidderId);

  // check if user id is valid
  if (!user) {
    res.status(404).json({ error: `User ${bidderId} not found` });
  }
  // check if user has enough balance to place this bid
  if (user.balance < bid.amount) {
    res.status(400).json({ error: `User ${bidderId} cannot afford this bid!` });
  }

  const { currentBid, minIncrement } = auction;
  const minimumBid = currentBid.amount + minIncrement;

  // check if bid amount is high enough
  if (bid.amount < minimumBid) {
    res.status(400).json({ error: `Bid amount too low! Minimum bid must be: ${minimumBid}`})
  }

  // update our database
  auction.currentBid = bid;
  auctions.set(auctionId, auction);
  const bidId = uuid.v4();
  bid.id = bidId;
  bids.set(bidId, bid);

  // return success
  res.status(200).json({ bid });
});

router.post('/user', (req, res) => {
  const user: User = req.body.user;
  const id = uuid.v4();
  user.id = id;
  users.set(id, user);
  res.status(200).json({ user });
});


export default router;
