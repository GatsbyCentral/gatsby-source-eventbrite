const fetch = require(`./fetch`)
const _ = require('lodash')
const { defaultEntities } = require('./defaultEntities')
const { linkEventWithVenue } = require('./createNodeRelations')
const processEntry = require('./processEntry')

// Add prefix for Eventbrite
const typePrefix = `Eventbrite`
const makeTypeName = type => _.upperFirst(_.camelCase(`${typePrefix} ${type}`))

exports.sourceNodes = async (
  { actions, getNode, store, cache, createNodeId },
  options
) => {
  const { createNode } = actions
  const { organizationId, accessToken, entities = [] } = options

  // Merge default entities with configured ones
  const entitiesToFetch = [...new Set([...defaultEntities, ...entities])]

  // Fetch all defined entities and create nodes
  const nodes = {}

  const processedEntries = entitiesToFetch.map(entity => {
    return fetch({ organizationId, accessToken, entity })
      .then(entries =>
        entries[entity].map(entry => processEntry(entry, entity, createNodeId))
      )
      .then(entries => (nodes[entity] = entries))
  })

  await Promise.all(processedEntries).then(() => {
    Object.keys(nodes).forEach(entity => {
      if (entity === 'events') {
        nodes[entity].forEach(node => {          
          linkEventWithVenue(nodes, entity)
        })
      }
      nodes[entity].forEach(entry => createNode(entry))
    })
  })
}
