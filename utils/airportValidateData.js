const validateAirportFields = (req, res, next) => {
  const airport = req.body;
  const errors = [];

  if (typeof airport.AIRSPACE_CLASS !== "string") {
    errors.push("AIRSPACE_CLASS must be a string.");
  }
  if (isNaN(airport.ELEV)) {
    errors.push("ELEV must be a number.");
  }
  if (isNaN(airport.HRS_CLOSE)) {
    errors.push("HRS_CLOSE must be a number.");
  }
  if (isNaN(airport.HRS_OPEN)) {
    errors.push("HRS_OPEN must be a number.");
  }
  if (typeof airport.ICAO !== "string") {
    errors.push("ICAO must be a string.");
  }
  if (typeof airport.LAT !== "string") {
    errors.push("LAT must be a string.");
  }
  if (typeof airport.LONG !== "string") {
    errors.push("LONG must be a string.");
  }
  if (typeof airport.NAME !== "string") {
    errors.push("NAME must be a string.");
  }
  if (typeof airport.NOTES !== "string") {
    errors.push("NOTES must be a string.");
  }
  if (typeof airport.TOWERED !== "string") {
    errors.push("TOWERED must be a string.");
  }
  if (typeof airport.UPDATED_BY !== "string") {
    errors.push("UPDATED_BY must be a string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = validateAirportFields;
