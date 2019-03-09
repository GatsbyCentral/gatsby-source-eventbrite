const fetch = require(`./fetch`)
const _ = require('lodash')
const { defaultEntities } = require('./defaultEntities')
const { linkEventWithVenue } = require('./createNodeRelations')
const processEntry = require('./processEntry')
const withLocalMedia = require('./withLocalMedia')

exports.sourceNodes = async (
  { actions, getNode, store, cache, createNodeId },
  options
) => {
  const { createNode, touchNode } = actions
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
      .then(entries => 
        Promise.all(
          entries.map(async entry =>{
            const entryWithLocalMedia = await withLocalMedia({ entity, entry, createNode, createNodeId, store, cache, touchNode });
            return entryWithLocalMedia;
          })
        )
      )
      .then(entries => (nodes[entity] = entries))
  })

  await Promise.all(processedEntries).then(() => {
    Object.keys(nodes).forEach(entity => {
      if (entity === 'events') {
        nodes[entity].forEach(() => {
          linkEventWithVenue(nodes, entity)
        })
      }
      nodes[entity].forEach(entry => createNode(entry))
    })
  })
}
