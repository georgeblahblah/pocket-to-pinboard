# Pocket to Pinboard Sync

A simple program to sync bookmarks from [Pocket](https://getpocket.com/) to [Pinboard](https://pinboard.in). I wrote this because there aren't any good iOS apps which allow easy saving of links to Pinboard. The official Pocket app is very good, so I save bookmarks there. This service syncs them to Pinboard.

Pinboard does have an option to sync public bookmarks from Pocket, but I didn't want to make all my bookmarks public.

Deployed as a Lambda on AWS, triggered hourly (but not necessarily on the hour). It syncs bookmarks to Pinboard, and archives in Pocket so they're not sync'd again.

## Developer setup

* Switch to the specified `node` version in [`.nvmrc`](.nvmrc)
* Install dependencies with `yarn install`
* Fetch AWS credentials with permission to read from Parameter Store under the path specified in [src/config.ts](src/config.ts)
* Run with `yarn start`

## Deployment

* To deploy locally, install [AWS SAM](https://aws.amazon.com/serverless/sam/) and run `sam build`, then `sam deploy`
* Otherwise, any push to the `main` branch on GitHub will deploy
