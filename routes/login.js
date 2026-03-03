const { Router } = require("express");
const router = Router();
const userDAO = require("../daos/user");
const jwt = require("jsonwebtoken");

/*
========================================
SIGNUP
========================================
*/
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing email or password");
    }

    const existingUser = await userDAO.getUser(email);

    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const hashedPass = await userDAO.hashPassword(password);
    const newUser = await userDAO.createUser(email, hashedPass);

    return res.json({ newUser });

  } catch (err) {
    next(err);
  }
});


/*
========================================
LOGIN
========================================
*/
router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing credentials");
    }

    const user = await userDAO.getUser(email);

    if (!user) {
      return res.status(401).send("User does not exist");
    }

    const passwordValid = await userDAO.checkPassword(email, password);

    if (!passwordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });

  } catch (err) {
    next(err);
  }
});


/*
========================================
CHECK ADMIN
========================================
*/
router.post("/isadmin", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ admin: false });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isAdmin =
      Array.isArray(decoded.roles) &&
      decoded.roles.includes("admin");

    return res.json({ admin: isAdmin });

  } catch (err) {
    return res.status(401).json({ admin: false });
  }
});


/*
========================================
UPDATE PASSWORD
========================================
*/
router.post("/password", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { password } = req.body;

    if (!password) {
      return res.status(400).send("No password provided");
    }

    const hashedPass = await userDAO.hashPassword(password);

    const updated = await userDAO.updateUserPassword(decoded._id, hashedPass);

    if (!updated) {
      return res.status(500).send("Password update failed");
    }

    return res.status(200).send("Password updated");

  } catch (err) {
    return res.status(401).send("Invalid token");
  }
});


module.exports = router;