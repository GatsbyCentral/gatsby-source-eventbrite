const { createRemoteFileNode } = require('gatsby-source-filesystem');

const createMediaNode = async({ url, createNode, createNodeId, store, cache, touchNode }) => {
  let fileNodeID;
      
  const mediaDataCacheKey = `eventbrite-media-${url}`
  const cacheMediaData = await cache.get(mediaDataCacheKey)

  if (cacheMediaData) {
    fileNodeID = cacheMediaData.fileNodeID
    touchNode({ nodeId: cacheMediaData.fileNodeID })
  }
  
  if (!fileNodeID) {
    try {
      const fileNode = await createRemoteFileNode({
        url,
        store,
        cache,
        createNode,
        createNodeId,
      })

      if (fileNode) {
        fileNodeID = fileNode.id
        await cache.set(mediaDataCacheKey, { fileNodeID })
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return fileNodeID;

}

module.exports = async ({ entity, entry, createNode, createNodeId, store, cache, touchNode } ) => {
  let fileNodeID;
  
  if (entity === 'events') {
    if (entry.logo && entry.logo.original){
      fileNodeID = await createMediaNode(
        { createNode, createNodeId, store, cache, touchNode, url: entry.logo.original.url}
      )
    }
  }

  if (fileNodeID) {
    return{
      ...entry,
      logo: {
        ...entry.logo,
        original: {
          ...entry.logo.original,
          localFile___NODE: fileNodeID,
        }
      }
    };
  }

  return entry;
}