const axios = require(`axios`)
const httpExceptionHandler = require(`./http-exception-handler`)

/**
 * High-level function to coordinate fetching data from eventbrite.com
 * @param {string} accessToken - The access token for eventbrite.com
 * @param {string} entity - The endpoint to fetch
 */
async function fetch({ accessToken, entity }) {
  console.time(`Fetch Eventbrite data`)
  console.log(`Starting to fetch data from Eventbrite`)

  let result = {}
  try {
    let res = await axios({
      method: `get`,
      // Fetch events from the user (paginated, 50 per page)
      // TODO Implement other URI's
      url: `https://www.eventbriteapi.com/v3/users/me/${entity}?token=${accessToken}`,
    })
    result = res.data
  } catch (e) {
    httpExceptionHandler(e)
  }

  return result
}
module.exports = fetch
