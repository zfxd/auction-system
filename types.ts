export type Auction = {
  id?: string;
  uuid: string;
  auctioneer: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  startingBid: number;
  currentBid: Bid;
  minIncrement: number;	// the minimum difference between the highest existing bid and an incoming bid
}

export type Bid = {
  id: string;
  auctionId: string;
  bidder: string;
  amount: number;
}

export type User = {
  id: string;
  username: string;
  balance: number;
}

export type Item = {
  id: string;
  owner: string;
  value: number;
}
