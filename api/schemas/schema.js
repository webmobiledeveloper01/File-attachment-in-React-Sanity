// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
import user from './user'
import station from './station'
import postedBy from './postedBy'
import analyzers from './analyzers'
import comments from './comments'
import manual from './manual'
import stationFiles from './stationFiles'
import sop from './sop'
// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    user,
    station,
    postedBy,
    analyzers,
    comments,
    manual,
    sop,
    stationFiles
  ]),
})
