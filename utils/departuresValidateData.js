const validateDepartureFields = (req, res, next) => {
    const departure = req.body;
    const errors = [];
  
    if (typeof departure.CLIMB !== "string") {
      errors.push("CLIMB must be a string.");
    }
    if (typeof departure.EXPECT_CRUISE !== "string") {
      errors.push("EXPECT_CRUISE must be a string.");
    }
    if (typeof departure.ICAO !== "string") {
        errors.push("ICAO must be a string.");
    }
    if (typeof departure.NAME !== "string") {
        errors.push("NAME must be a string.");
    }
    if (isNaN(departure.NUM)) {
      errors.push("NUM must be a number.");
    }
    if (typeof departure.PROCEDURE !== "string") {
        errors.push("PROCEDURE must be a string.");
    }
    if (typeof departure.RWY_SPECIFIC !== "string") {
        errors.push("NAME must be a string.");
    }
    if (typeof departure.TOP_ALT !== "string") {
    errors.push("TOP_ALT must be a string.");
    }
    if (typeof departure.TOP_ALT_LISTED !== "string") {
        errors.push("TOP_ALT_LISTED must be a string.");
    }
    if (typeof departure.TOP_ALT_STATE !== "string") {
        errors.push("TOP_ALT_STATE must be a string.");
    } 
    if (typeof departure.NEED_FOR_INTERIM_ALT !== "string") {
        errors.push("NEED_FOR_INTERIM_ALT must be a string.");
    }
    if (typeof departure.TYPE !== "string") {
      errors.push("TYPE must be a string.");
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  };
  
  module.exports = validateDepartureFields;
  