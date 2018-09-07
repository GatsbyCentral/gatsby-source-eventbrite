//Form one - one parent/child relation between event and venue
const linkEventWithVenue = (nodes, entity) => {
  const joinVenueToEvent = (eventVenueId, nodes) =>
    nodes.venues.filter(venue => venue.id === eventVenueId)[0]

  nodes[entity].forEach(node => {
    node['venue'] = joinVenueToEvent(node.venue_id, nodes)
  })
}

module.exports = { linkEventWithVenue }
