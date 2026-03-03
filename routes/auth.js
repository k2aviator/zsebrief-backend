const { Router } = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

/*
  POST /auth/vatsim/exchange
  Body: { code: "AUTH_CODE_FROM_VATSIM" }
*/
router.post("/vatsim/exchange", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    /*
      1️⃣ Exchange authorization code for VATSIM access token
    */
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.VATSIM_CLIENT_ID);
    params.append("client_secret", process.env.VATSIM_CLIENT_SECRET);
    params.append("redirect_uri", process.env.VATSIM_REDIRECT_URI);
    params.append("code", code);

      const tokenResponse = await axios.post(
      `${process.env.VATSIM_BASE_URL}/oauth/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(
      `${process.env.VATSIM_BASE_URL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    const vatsimUser = userResponse.data.data;

    if (!vatsimUser) {
      return res.status(500).json({ error: "No user data returned" });
    }

    const cid = vatsimUser.cid;
    const fullName = vatsimUser.personal?.name_full;
    const email = vatsimUser.personal?.email;
    const rating = vatsimUser.vatsim?.rating?.long;

    /*
      3️⃣ Find or create user in MongoDB
    */
    let user = await User.findOne({ cid });

if (!user) {
  // Try finding by email (legacy user)
  user = await User.findOne({ email });
    if (user) {
      // Update existing user with VATSIM info
      user.cid = cid;
      user.authProvider = "vatsim";
      user.rating = rating;
      await user.save();
    } else {
      // Create completely new user
      user = await User.create({
        cid,
        email,
        fullName,
        rating,
        roles: ["user"],
        authProvider: "vatsim"
      });
    }
    }

    /*
      4️⃣ Create YOUR app JWT
    */
    const appToken = jwt.sign(
      {
        _id: user._id,
        cid: user.cid,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /*
      5️⃣ Return token to frontend
    */
    return res.json({ token: appToken });

  } catch (err) {
    console.error("OAuth exchange error:", err.response?.data || err.message);
    return res.status(500).json({ error: "OAuth exchange failed" });
  }
});

module.exports = router;