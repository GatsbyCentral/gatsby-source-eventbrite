const crypto = require('crypto')
const _ = require('lodash')

// Add prefix for Eventbrite
const typePrefix = `Eventbrite`
const makeTypeName = type => _.upperFirst(_.camelCase(`${typePrefix} ${type}`))

module.exports = (entry, type, createNodeId) => {
  const nodeId = createNodeId(entry.id)
  const nodeContent = JSON.stringify(entry)
  const nodeContentDigest = crypto
    .createHash('md5')
    .update(nodeContent)
    .digest('hex')

  return {
    id: nodeId,
    parent: null,
    ...entry,
    children: [],
    internal: {
      type: `${makeTypeName(type)}`,
      content: nodeContent,
      contentDigest: nodeContentDigest,
    },
  }
}
