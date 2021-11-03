import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import type { Db } from 'mongodb';

let db : Db;

let connection : MongoClient;

const connect = () => (db
  ? Promise.resolve(db)
  : MongoMemoryServer.create()
    .then((server) => server.getUri())
    .then((URL) => MongoClient.connect(URL))
    .then((newConnection) => {
      connection = newConnection;
      db = connection.db('mock_db');
      return db;
    })
);

export const disconnect = () => connection.close();

export default connect;
