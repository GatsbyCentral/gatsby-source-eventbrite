const axios = require(`axios`)
const httpExceptionHandler = require(`./http-exception-handler`)

/**
 * High-level function to coordinate fetching data from Lever.co
 * site.
 */
async function fetch({ accessToken }) {
  // return require(`./data.json`)

  let result = {}
  try {
    let res = await axios({
      method: `get`,
      // Fetch events from the user (paginated, 50 per page)
      // TODO Implement other URI's
      url: `https://www.eventbriteapi.com/v3/users/me/events?token=${accessToken}`,
    })
    result = res.data
  } catch (e) {
    httpExceptionHandler(e)
  }

  return result
}
module.exports = fetch
