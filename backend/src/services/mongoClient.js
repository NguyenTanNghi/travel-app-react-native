const { MongoClient } = require("mongodb");
const seed = require("../data/seedData");

let client;
let db;
let connectionPromise;

function getMongoUri() {
  const uri = process.env.URL_MONGO_DB;

  if (!uri) {
    throw new Error("URL_MONGO_DB is required to connect to MongoDB");
  }

  return uri;
}

function withEmailLower(user) {
  return {
    ...user,
    emailLower: String(user.email ?? "").trim().toLowerCase(),
  };
}

async function ensureIndexes(database) {
  await Promise.all([
    database.collection("appContent").createIndex({ id: 1 }, { unique: true }),
    database.collection("bookings").createIndex({ id: 1 }, { unique: true }),
    database.collection("bookings").createIndex({ userId: 1 }),
    database.collection("notifications").createIndex({ id: 1 }, { unique: true }),
    database.collection("places").createIndex({ id: 1 }, { unique: true }),
    database.collection("scheduleItems").createIndex({ id: 1 }, { unique: true }),
    database.collection("sessions").createIndex({ token: 1 }, { unique: true }),
    database.collection("tripPackages").createIndex({ id: 1 }, { unique: true }),
    database.collection("users").createIndex({ id: 1 }, { unique: true }),
  ]);

  const usersWithoutEmailLower = await database
    .collection("users")
    .find({
      email: { $exists: true },
      emailLower: { $exists: false },
    })
    .toArray();

  await Promise.all(
    usersWithoutEmailLower.map((user) =>
      database.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            emailLower: String(user.email ?? "").trim().toLowerCase(),
          },
        },
      ),
    ),
  );

  await database
    .collection("users")
    .createIndex({ emailLower: 1 }, { sparse: true, unique: true });
}

async function seedCollectionIfEmpty(database, collectionName, documents) {
  const collection = database.collection(collectionName);
  const count = await collection.estimatedDocumentCount();

  if (count === 0 && documents.length > 0) {
    await collection.insertMany(documents);
  }
}

async function ensureSeedData(database) {
  await seedCollectionIfEmpty(database, "places", seed.places);
  await seedCollectionIfEmpty(database, "tripPackages", seed.tripPackages);
  await seedCollectionIfEmpty(database, "scheduleItems", seed.scheduleItems);
  await seedCollectionIfEmpty(database, "notifications", seed.notifications);
  await seedCollectionIfEmpty(
    database,
    "users",
    seed.users.map((user) => withEmailLower(user)),
  );

  await database.collection("appContent").updateOne(
    { id: "default" },
    {
      $setOnInsert: {
        aiChatStarterMessages: seed.aiChatStarterMessages,
        avatarImages: seed.avatarImages,
        id: "default",
        onboardingSlides: seed.onboardingSlides,
      },
    },
    { upsert: true },
  );
}

async function connectToMongo() {
  if (db) {
    return db;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      client = new MongoClient(getMongoUri());
      await client.connect();

      const databaseName = process.env.MONGO_DB_NAME ?? "travel_app";
      db = client.db(databaseName);

      await ensureIndexes(db);
      await ensureSeedData(db);

      return db;
    })();
  }

  return connectionPromise;
}

async function getCollections() {
  const database = await connectToMongo();

  return {
    appContent: database.collection("appContent"),
    bookings: database.collection("bookings"),
    notifications: database.collection("notifications"),
    places: database.collection("places"),
    scheduleItems: database.collection("scheduleItems"),
    sessions: database.collection("sessions"),
    tripPackages: database.collection("tripPackages"),
    users: database.collection("users"),
  };
}

async function closeMongo() {
  if (client) {
    await client.close();
  }

  client = undefined;
  db = undefined;
  connectionPromise = undefined;
}

module.exports = {
  closeMongo,
  connectToMongo,
  getCollections,
  withEmailLower,
};
