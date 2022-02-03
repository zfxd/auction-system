import express from 'express';
import * as uuid from 'uuid';
import { Auction, Bid, User } from './types';

const router = express.Router();

// our 'database' (we'll be adding an actual database connection during the SQL workshop)
const auctions = new Map<string, Auction>();
const bids = new Map<string, Bid>();
const users = new Map<string, User>();

// add a fake auctioneer
const auctioneerId = '249b2f8b-5285-4031-a164-63102017a9ba';
// Creating an object:
// Create an auctioneer object of type User
const auctioneer: User = {
  id: auctioneerId,
  username: 'auctioneer',
  balance: 100,
}
users.set(auctioneerId, auctioneer);

// define the routes
//                     Anonymous f(x) - a function with no name. Used when you want to pass in a function into another function.
router.get('/auctions', (req, res) => {
  // Get all the auctions that currently exist in our database
  const auctionList = Array.from(auctions.values());
  //response:code 200   & return json of our auctionList
  return res.status(200).json({ auctions: auctionList });
});

router.get('/auction/:id', (req, res) => {
  // const id = req.params.id (equivalent code)
  const { id } = req.params;
  const auction = auctions.get(id);
  if (auction) {
    res.status(200).json({ auction });
  } else {
    res.status(404).json({ error: `Auction ${id} not found` });
  }
});

router.post('/auction', (req, res) => {
  // Getting the entire auction object in the body of the request
  const auction: Auction = req.body.auction;
  auction.start = new Date(auction.start);
  auction.end = new Date(auction.end);
  const id = uuid.v4();
  auction.id = id;
  // Add it to the map (database)
  auctions.set(id, auction)
  res.status(200).json({auction: auction});   // One branch, does not need to return, but multiple branches must return to stop early! If not it'll keep throwing errors.
});

router.post('/auction/:id/bid', (req, res) => {
  // TODO: implement based on below steps
  // 1. check if auction id is valid
  const auctionID = req.params.id;
  const auction = auctions.get(auctionID);
  if(!auction) // i.e. auction doesn't exist
  {
    res.status(404).json({error: `Auction ${auctionID} not found`});
  }
  // 2. check if auction hasn't ended

  const now = new Date();
  const isOngoing = now >= auction.start && now <= auction.end;
  if (!isOngoing)
  {
    return res.status(400).json({error: 'Auction ${auctionID} is not currently running'});
    // ERROR 400 = bad request
  }
  // 3. check if user id is valid
  const bid: Bid = req.body.bid;
  const bidderID = bid.bidder;
  const bidder = users.get(bidderID);
  if (!bidder) // bidder doesn't exist
  {
    return res.status(404).json({ error: 'User ${bidderID} not found'});
  }
  
  // 4. check if user has enough balance to place this bid
  if (bidder.balance < bid.amount)
  {
    return res.status(400).json({ error: 'User ${bidder.username} cannot afford this bid'});
  }

  // 5. check if bid amount is high enough
  // Get these two values from the auction
  const {currentBid, minIncrement } = auction;
  let minimumBid = 0;
  if (!currentBid){
    minimumBid = auction.startingPrice + minIncrement;
  }
  else {
    minimumBid = currentBid.amount + minIncrement;
  }

  if (bid.amount < minimumBid) {
    return res.status(400).json({ error: 'Bid amount must be higher than ${minimumBid}'});
  }
  
  // 6. update our database
  auction.currentBid = bid;
  bid.auction = auction.id;
  auctions.set(auctionID, auction); // Updates the object on the database
  
  const bidID = uuid.v4();
  bid.id = bidID;
  bids.set(bidID, bid); // Update the bid
  // 7. return successful response
  return res.status(400).json({bid: bid});
});

router.post('/user', (req, res) => {
  // TODO: implement
  const user: User = req.body.user;
  const id = uuid.v4();
  user.id = id;
  users.set(id, user);
  res.status(200).json({ user });
});

export default router;
