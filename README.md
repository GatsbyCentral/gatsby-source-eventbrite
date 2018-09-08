
# gatsby-source-eventbrite

[![Greenkeeper badge](https://badges.greenkeeper.io/GatsbyCentral/gatsby-source-eventbrite.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/GatsbyCentral/gatsby-source-eventbrite.svg?branch=master)](https://travis-ci.org/GatsbyCentral/gatsby-source-eventbrite)

Source plugin for pulling events and related data from eventbrite. 

WORK IN PROGRESS: At the moment it just fetches `events` and `venues` from eventbrite.com without further processing or filtering. Other Endpoints are configurable but haven't been tested yet.
Works with Eventbrite's API v3.

## Install

`npm install --save gatsby-source-eventbrite`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-eventbrite`,
    options: {
      organizationId: `The ID of your organization`,
      accessToken: `your_access_token`,
      // OPTIONAL: Defaults are Events and Venues
      entities: ['events', 'venues','...']
    },
  },
]
```
