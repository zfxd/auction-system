export type Auction = {
  uuid: string;
  auctioneer: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  item: string;
  startingBid: number
  minIncrement: number	// the minimum difference between the highest existing bid and an incoming bid
}

export type Bid = {
  uuid: string;
  auction: string;
  bidder: string;
  amount: number;
}

export type User = {
  uuid: string;
  username: string;
  balance: number;
}

export type Item = {
  uuid: string;
  owner: string;
  value: number;
}
