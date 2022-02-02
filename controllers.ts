import express from 'express';
import * as uuid from 'uuid';
import { Auction, Bid, User } from './types';

const router = express.Router();

// our 'database' (we'll be adding an actual database connection during the SQL workshop)
const auctions = new Map<string, Auction>();
const bids = new Map<string, Bid>();
const users = new Map<string, User>();

router.get('/auctions', (req, res) => {
  const auctionList = Array.from(auctions.values());
  return res.status(200).json({ auctions: auctionList });
});

router.get('/auction/:id', (req, res) => {
  const id: string = req.params.id;
  const auction = auctions.get(id);
  if (auction) {
    return res.status(200).json({ auction });
  } else {
    return res.status(404).json({ error: `Auction ${id} not found` });
  }
});

router.post('/auction', (req, res) => {
  const auction: Auction = req.body.auction;

  // convert strings to dates
  auction.start = new Date(auction.start);
  auction.end = new Date(auction.end);

  // create auction
  const id = uuid.v4();
  auction.id = id;
  auctions.set(id, auction);

  return res.status(200).json({ auction });
});

router.post('/auction/:id/bid', (req, res) => {
  const auctionId: string = req.params.id;
  const auction = auctions.get(auctionId);
  // check if auction id is valid
  if (!auction) {
    return res.status(404).json({ error: `Auction ${auctionId} not found` });
  }
  // check if auction is ongoing
  const now = new Date();
  const isOngoing = now >= auction.start && now <= auction.end;
  if (!isOngoing) {
    return res.status(400).json({ error: `Auction ${auctionId} is not currently running!` });
  }

  const bid: Bid = req.body.bid;
  const bidderId = bid.bidder;
  const user = users.get(bidderId);

  // check if user id is valid
  if (!user) {
    return res.status(404).json({ error: `User ${bidderId} not found` });
  }
  // check if user has enough balance to place this bid
  if (user.balance < bid.amount) {
    return res.status(400).json({ error: `User ${bidderId} cannot afford this bid!` });
  }

  // check if bid amount is high enough
  const { currentBid, minIncrement } = auction;
  let minimumBid = 0;
  if (!currentBid) {
    minimumBid = auction.startingPrice + minIncrement;
  } else {
    minimumBid = currentBid.amount + minIncrement;
  }
  if (bid.amount < minimumBid) {
    return res.status(400).json({ error: `Bid amount too low! Minimum bid must be: ${minimumBid}`})
  }

  // update our database
  auction.currentBid = bid;
  bid.auctionId = auction.id;
  auctions.set(auctionId, auction);
  const bidId = uuid.v4();
  bid.id = bidId;
  bids.set(bidId, bid);

  // return success
  return res.status(200).json({ bid });
});

router.post('/user', (req, res) => {
  const user: User = req.body.user;
  const id = uuid.v4();
  user.id = id;
  users.set(id, user);
  return res.status(200).json({ user });
});


export default router;
