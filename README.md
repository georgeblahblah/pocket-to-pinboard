# Pocket to Pinboard Sync

A simple program to sync unread bookmarks from [Pocket](https://getpocket.com/) to [Pinboard](https://pinboard.in). I created this because there aren't any good iOS apps which allow easy saving of links to Pinboard. The official Pocket app is very good, so I save my links there and this service syncs them to Pinboard.

Deployed as a Lambda on AWS, triggered on a schedule. It syncs unread bookmarks to Pinboard, and marks them as read so they're not sync'd again.

## Developer setup

* Switch to the specified `node` version in [`.nvmrc`](.nvmrc)
* Run `yarn install`
