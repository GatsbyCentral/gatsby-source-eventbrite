# gatsby-source-eventbrite

Source plugin for pulling events and related data from eventbrite. 

WORK IN PROGRESS: At the moment it just fetches `events` from eventbrite.com without further processing or filtering. 

## Install

`npm install --save gatsby-source-eventbrite`

## How to use

### Using Delivery API

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-eventbrite`,
    options: {
      accessToken: `your_access_token`,
    },
  },
]
```
