const bcrypt = require('bcryptjs');

const config = require('../config');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

async function geocodeAddress(address) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address,
  )}.json?access_token=${config.MAP_BOX_API_KEY}&limit=1&country=PK`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'quick-bite-app/1.0 (quick-bite@gmail.com)',
    },
  });
  const data = await response.json();

  if (data.features && data.features.length > 0) {
    const [longitude, latitude] = data.features[0].center;
    return { latitude, longitude };
  }
  else {
    throw new Error('Location not found');
  }
}

module.exports = { hashPassword, comparePassword, geocodeAddress };
