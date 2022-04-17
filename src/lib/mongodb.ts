import { Db, MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DBNAME = process.env.DB_NAME

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Define the MONGODB_URI environmental variable')
}

// check the MongoDB DB
if (!MONGODB_DBNAME) {
  throw new Error('Define the MONGODB_DB environmental variable')
}

let cachedClient: MongoClient
let cachedDb: Db

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  await client.connect()

  const db = client.db(MONGODB_DBNAME)

  cachedClient = client
  cachedDb = db

  return {
    client,
    db,
  }
}
