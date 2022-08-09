import dotenv from 'dotenv';


dotenv.config();

export default {
    port: parseInt(process.env.PORT || '3001'),

    // storage
    storage: process.env.STORAGE || 'mongo',
    mongo_connection_string: process.env.STORAGE_MONGO_CONN_STRING || 'mongodb://localhost:27017/?replicaSet=rs0',
    mongo_db_name: process.env.STORAGE_MONGO_DB_NAME = 'newslett',
    mongo_feed_collection: process.env.STORAGE_MONGO_FEED_COLLECTION || 'feed',
    mongo_token_collection: process.env.STORAGE_MONGO_TOKEN_COLLECTION || 'token',
    mongo_rss_metadata_collection: process.env.STORAGE_MONGO_RSS_METADATA_COLLECTION || 'rssmetadata' ,
    mongo_event_collection: process.env.STORAGE_MONGO_EVENT_COLLECTION || 'event',

    cron_expression: process.env.CRON_EXPRESSION || '* * * * *' ,

    event_content: 'event_content_local'


}

