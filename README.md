# rss-to-medium
> create RSS feeds from Medium users/collections

## Installation

    npm install rss-to-medium

## Usage

### `createUserFeed(username, callback)`

Create an RSS feed from `username` on Medium. Callback signature is `function(err, feed) {...}`, where `feed` is the resulting RSS feed as a String.
