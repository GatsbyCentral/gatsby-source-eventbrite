const axios = require(`axios`)
const httpExceptionHandler = require(`./http-exception-handler`)

/**
 * High-level function to coordinate fetching data from eventbrite.com
 * @param {string} organizationId - The organizationId of the eventbrite account
 * @param {string} accessToken - The access token for eventbrite.com
 * @param {string} entity - The endpoint to fetch
 */
async function fetch({ organizationId, accessToken, entity }) {
  console.log(`Fetch Eventbrite data for '${entity}' entity`)
  // Fetch events from the user (paginated, 50 per page)
  // TODO Implement other URI's
  try {
    return axios({
      method: `get`,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:51.0) Gecko/20100101 Firefox/51.0',
      },

      // Fetch events from the user (paginated, 50 per page)
      // TODO Implement other URI's
      url: `https://www.eventbriteapi.com/v3/organizations/${organizationId}/${entity}?token=${accessToken}`,
    }).then(res => res.data)
  } catch (e) {
    httpExceptionHandler(e)
  }

  return result
}
module.exports = fetch
