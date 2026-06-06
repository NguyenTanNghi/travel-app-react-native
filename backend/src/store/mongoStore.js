const crypto = require("crypto");
const { getCollections, withEmailLower } = require("../services/mongoClient");

function stripMongoId(value) {
  if (Array.isArray(value)) {
    return value.map(stripMongoId);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((result, [key, entry]) => {
      if (key !== "_id") {
        result[key] = stripMongoId(entry);
      }

      return result;
    }, {});
  }

  return value;
}

function clone(value) {
  if (value === undefined || value === null) {
    return value;
  }

  return stripMongoId(JSON.parse(JSON.stringify(value)));
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const {
    emailLower,
    emailVerificationOtp,
    password,
    resetOtp,
    ...safeUser
  } = user;

  return clone(safeUser);
}

async function findUserByEmail(email) {
  const { users } = await getCollections();
  return users.findOne({ emailLower: normalizeText(email) });
}

async function getUserById(userId) {
  const { users } = await getCollections();
  return users.findOne({ id: userId });
}

async function createSession(userId) {
  const { sessions } = await getCollections();
  const token = crypto.randomBytes(32).toString("hex");

  await sessions.insertOne({
    createdAt: new Date().toISOString(),
    token,
    userId,
  });

  return token;
}

async function getUserByToken(token) {
  const { sessions, users } = await getCollections();
  const session = await sessions.findOne({ token });

  if (!session) {
    return null;
  }

  return users.findOne({ id: session.userId });
}

async function destroySession(token) {
  const { sessions } = await getCollections();
  await sessions.deleteOne({ token });
}

async function registerUser({ email, name, password }) {
  const { users } = await getCollections();
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email already exists");
    error.status = 409;
    throw error;
  }

  const trimmedName = String(name ?? "").trim();
  const [firstName = trimmedName, ...rest] = trimmedName.split(" ");
  const lastName = rest.join(" ");
  const user = withEmailLower({
    avatar: "",
    bucketList: 0,
    email: String(email).trim(),
    emailVerifiedAt: null,
    favoritePlaceIds: [],
    firstName,
    id: createId("user"),
    isEmailVerified: false,
    lastName,
    location: "",
    mobileNumber: "",
    name: trimmedName,
    password,
    rewardPoints: 0,
    travelTrips: 0,
  });

  await users.insertOne(user);
  return user;
}

async function updateUser(userId, payload) {
  const { users } = await getCollections();
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const $set = {};
  let emailVerificationOtp = null;
  const nextEmail = String(payload.email ?? "").trim();

  if (nextEmail && normalizeText(nextEmail) !== normalizeText(user.email)) {
    const existingUser = await findUserByEmail(nextEmail);

    if (existingUser && existingUser.id !== user.id) {
      const error = new Error("Email already exists");
      error.status = 409;
      throw error;
    }

    emailVerificationOtp = createOtp();
    Object.assign($set, {
      email: nextEmail,
      emailLower: normalizeText(nextEmail),
      emailVerificationOtp,
      emailVerifiedAt: null,
      isEmailVerified: false,
    });
  }

  const allowedFields = [
    "avatar",
    "firstName",
    "lastName",
    "location",
    "mobileNumber",
    "name",
  ];

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      $set[field] = payload[field];
    }
  });

  if (!payload.name && (payload.firstName !== undefined || payload.lastName !== undefined)) {
    const nextFirstName =
      payload.firstName !== undefined ? payload.firstName : user.firstName;
    const nextLastName =
      payload.lastName !== undefined ? payload.lastName : user.lastName;

    $set.name = [nextLastName, nextFirstName].filter(Boolean).join(" ").trim();
  }

  if (Object.keys($set).length > 0) {
    await users.updateOne({ id: userId }, { $set });
  }

  return {
    emailVerificationOtp,
    user: await getUserById(userId),
  };
}

async function listPlaces(filters = {}) {
  const { places } = await getCollections();
  const query = {};
  const search = String(filters.search ?? "").trim();
  const category = String(filters.category ?? "").trim();
  const country = String(filters.country ?? "").trim();
  const popular =
    filters.popular === true ||
    filters.popular === "true" ||
    filters.popular === "1";

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { category: regex },
      { country: regex },
      { location: regex },
      { title: regex },
    ];
  }

  if (category) {
    query.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  }

  if (country) {
    query.country = new RegExp(`^${escapeRegex(country)}$`, "i");
  }

  if (popular) {
    query.isPopular = true;
  }

  return clone(await places.find(query).toArray());
}

async function getPlaceById(placeId) {
  const { places } = await getCollections();
  return clone(await places.findOne({ id: placeId }));
}

async function listTripPackages(filters = {}) {
  const { tripPackages } = await getCollections();
  const placeId = String(filters.placeId ?? "").trim();
  const query = placeId ? { placeId } : {};

  return clone(await tripPackages.find(query).toArray());
}

async function getTripPackageById(packageId) {
  const { tripPackages } = await getCollections();
  return clone(await tripPackages.findOne({ id: packageId }));
}

async function listScheduleItems() {
  const { scheduleItems } = await getCollections();
  return clone(await scheduleItems.find({}).toArray());
}

async function listNotifications(filters = {}) {
  const { notifications } = await getCollections();
  const status = String(filters.status ?? "").trim();
  const query = status ? { status } : {};

  return clone(await notifications.find(query).toArray());
}

async function clearNotifications(status) {
  const { notifications } = await getCollections();
  const query = status ? { status } : {};

  await notifications.deleteMany(query);
  return listNotifications();
}

async function getFavoritePlaceIds(userId) {
  const user = await getUserById(userId);
  return user ? [...(user.favoritePlaceIds ?? [])] : [];
}

async function listFavoritePlaces(userId) {
  const { places } = await getCollections();
  const favoritePlaceIds = await getFavoritePlaceIds(userId);

  return clone(
    await places.find({ id: { $in: favoritePlaceIds } }).toArray(),
  );
}

async function addFavorite(userId, placeId) {
  const { places, users } = await getCollections();
  const place = await places.findOne({ id: placeId });
  const user = await getUserById(userId);

  if (!user || !place) {
    return null;
  }

  await users.updateOne(
    { id: userId },
    {
      $addToSet: {
        favoritePlaceIds: placeId,
      },
    },
  );

  return {
    favoritePlaceIds: await getFavoritePlaceIds(userId),
    place: clone(place),
  };
}

async function removeFavorite(userId, placeId) {
  const { places, users } = await getCollections();
  const place = await places.findOne({ id: placeId });
  const user = await getUserById(userId);

  if (!user || !place) {
    return null;
  }

  await users.updateOne(
    { id: userId },
    {
      $pull: {
        favoritePlaceIds: placeId,
      },
    },
  );

  return {
    favoritePlaceIds: await getFavoritePlaceIds(userId),
    place: clone(place),
  };
}

async function toggleFavorite(userId, placeId) {
  const favoritePlaceIds = await getFavoritePlaceIds(userId);
  const isFavorite = favoritePlaceIds.includes(placeId);
  const result = isFavorite
    ? await removeFavorite(userId, placeId)
    : await addFavorite(userId, placeId);

  if (!result) {
    return null;
  }

  return {
    ...result,
    isFavorite: !isFavorite,
  };
}

async function createBooking(userId, payload) {
  const { bookings, places } = await getCollections();
  const place = await places.findOne({ id: payload.placeId });

  if (!place) {
    return null;
  }

  const guests = Math.max(1, Number(payload.guests ?? 1) || 1);
  const unitPrice = Number(place.price ?? 0);
  const booking = {
    createdAt: new Date().toISOString(),
    guests,
    id: createId("booking"),
    placeId: place.id,
    placeSnapshot: {
      country: place.country,
      image: place.image,
      location: place.location,
      price: unitPrice,
      title: place.title,
    },
    status: "confirmed",
    totalPrice: unitPrice * guests,
    travelDate: payload.travelDate ?? null,
    userId,
  };

  await bookings.insertOne(booking);
  return clone(booking);
}

async function listBookings(userId) {
  const { bookings, places } = await getCollections();
  const items = await bookings.find({ userId }).sort({ createdAt: -1 }).toArray();
  const missingSnapshotPlaceIds = [
    ...new Set(
      items
        .filter((booking) => !booking.placeSnapshot)
        .map((booking) => booking.placeId),
    ),
  ];
  const relatedPlaces =
    missingSnapshotPlaceIds.length > 0
      ? await places.find({ id: { $in: missingSnapshotPlaceIds } }).toArray()
      : [];
  const placeById = new Map(relatedPlaces.map((place) => [place.id, place]));

  return clone(
    items.map((booking) => {
      const place = placeById.get(booking.placeId);

      if (booking.placeSnapshot || !place) {
        return booking;
      }

      return {
        ...booking,
        placeSnapshot: {
          country: place.country,
          image: place.image,
          location: place.location,
          price: Number(place.price ?? 0),
          title: place.title,
        },
        totalPrice:
          booking.totalPrice ??
          Number(place.price ?? 0) * Math.max(1, Number(booking.guests ?? 1)),
      };
    }),
  );
}

async function setResetOtp(email) {
  const { users } = await getCollections();
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const resetOtp = createOtp();
  await users.updateOne({ id: user.id }, { $set: { resetOtp } });

  return resetOtp;
}

async function setEmailVerificationOtp(userId) {
  const { users } = await getCollections();
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const emailVerificationOtp = createOtp();
  await users.updateOne(
    { id: userId },
    {
      $set: {
        emailVerificationOtp,
        emailVerifiedAt: null,
        isEmailVerified: false,
      },
    },
  );

  return emailVerificationOtp;
}

async function verifyOtp(email, code) {
  const { users } = await getCollections();
  const user = await findUserByEmail(email);
  const normalizedCode = String(code ?? "");

  if (!user) {
    return false;
  }

  if (user.emailVerificationOtp === normalizedCode) {
    await users.updateOne(
      { id: user.id },
      {
        $set: {
          emailVerifiedAt: new Date().toISOString(),
          isEmailVerified: true,
        },
        $unset: {
          emailVerificationOtp: "",
        },
      },
    );

    return {
      purpose: "email_verification",
      user: await getUserById(user.id),
    };
  }

  if (user.resetOtp === normalizedCode) {
    await users.updateOne(
      { id: user.id },
      {
        $unset: {
          resetOtp: "",
        },
      },
    );

    return {
      purpose: "password_reset",
      user: await getUserById(user.id),
    };
  }

  return false;
}

async function getAppContent() {
  const { appContent } = await getCollections();
  return clone(await appContent.findOne({ id: "default" }));
}

module.exports = {
  addFavorite,
  clearNotifications,
  createBooking,
  createSession,
  destroySession,
  findUserByEmail,
  getAppContent,
  getFavoritePlaceIds,
  getPlaceById,
  getTripPackageById,
  getUserById,
  getUserByToken,
  listBookings,
  listFavoritePlaces,
  listNotifications,
  listPlaces,
  listScheduleItems,
  listTripPackages,
  registerUser,
  removeFavorite,
  sanitizeUser,
  setEmailVerificationOtp,
  setResetOtp,
  toggleFavorite,
  updateUser,
  verifyOtp,
};
