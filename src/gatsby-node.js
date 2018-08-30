const fetch = require(`./fetch`)
const _ = require('lodash')
const { defaultEntities } = require('./defaultEntities')
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

  //----------- USING ES6 ----------------------
  const processedEntries = entitiesToFetch.map(entity => {
    return (
      fetch({ organizationId, accessToken, entity })
        .then(entries =>
          entries[entity].map(entry =>
            processEntry(entry, entity, createNodeId)
          )
        )
        // .then(entries => (nodes[entity] = entries))
        .then(entries => {
          entries.forEach(entry => createNode(entry))
        })
    )
  })

  await Promise.all(processedEntries)

  // Promise.all(processedEntries).then(() => {
  //   console.log('---------------------')
  //   Object.keys(nodes).forEach(entity => {
  //     console.log('ENTITY: ', entity)
  //     nodes[entity].forEach(entry => createNode(entry))
  //   })}
  // )
  //----------- USING ES6 ----------------------

  // for (const entity of entitiesToFetch) {
  //   const result = await fetch({
  //     organizationId,
  //     accessToken,
  //     entity,
  //   })

  //   nodes[entity] = result[entity].map(entry =>
  //     processEntry(entry, entity, createNodeId)
  //   )
  // }

  // for (let entity in nodes) {
  //   nodes[entity].forEach(node => {
  //     createNode(node)
  //   })
  // }
}

/**
 * Create a node for the provided entity
 * @param {function} fn - `createNode` function
 * @param {array} nodes - The result entities from the eventbrite API
 * @param {string} type - The `type` of the entity
 */
const createNodes = function(fn, nodes, type) {
  nodes.forEach(node => {
    const jsonNode = JSON.stringify(node)
    fn({
      id: node.id,
      parent: null,
      ...node, // pass queried data into node
      children: [],
      internal: {
        type: `${makeTypeName(type)}`,
        // content: jsonNode,
        contentDigest: crypto
          .createHash(`md5`)
          .update(jsonNode)
          .digest(`hex`),
      },
    })
  })
}
