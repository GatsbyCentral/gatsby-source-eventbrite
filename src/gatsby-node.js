const crypto = require('crypto')
const _ = require('lodash')
const fetch = require(`./fetch`)
const { entities } = require('./entities')

// Add prefix for Eventbrite
const typePrefix = `Eventbrite`
const makeTypeName = type => _.upperFirst(_.camelCase(`${typePrefix} ${type}`))

exports.sourceNodes = async (
  { actions, getNode, store, cache, createNodeId },
  { accessToken }
) => {
  const { createNode } = actions

  // TODO Make entities configurable via gatsby-config and merge with defaults

  // Fetch all defined entities and create nodes
  // NOTE Need to use `for`. async/await does not work in `forEach` as expected.
  for (const entity of entities) {
    const result = await fetch({
      accessToken,
      entity: entity,
    })
    const entries = result[entity]
    createNodes(createNode, entries, `${entity}`)
  }
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
