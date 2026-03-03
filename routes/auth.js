const { Router } = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

/**
 * VATSIM OAuth Callback
 */
router.get("/vatsim/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const baseURL = process.env.VATSIM_BASE_URL; // dev or prod

    if (!baseURL) {
      throw new Error("VATSIM_BASE_URL not configured");
    }

    // 🔁 Exchange authorization code for access token
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.VATSIM_CLIENT_ID);
    params.append("client_secret", process.env.VATSIM_CLIENT_SECRET);
    params.append("redirect_uri", process.env.VATSIM_REDIRECT_URI);
    params.append("code", code);

    const tokenResponse = await axios.post(
      `${baseURL}/oauth/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error("No access token received from VATSIM");
    }

    // 👤 Fetch user info from VATSIM
    const userResponse = await axios.get(
      `${baseURL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const vatsimUser = userResponse.data.data;

    if (!vatsimUser) {
      throw new Error("No user data returned from VATSIM");
    }

    const cid = vatsimUser.cid;
    const fullName = vatsimUser.personal?.name_full || "";
    const email = vatsimUser.personal?.email || "";
    const rating = vatsimUser.vatsim?.rating?.long || "";

    // 🔎 Find or create user in MongoDB
    let user = await User.findOne({ cid });

    if (!user) {
      user = await User.create({
        cid,
        fullName,
        email,
        rating,
        roles: ["user"],
        authProvider: "vatsim"
      });
    }

    // 🔐 Create JWT for your app
    const appToken = jwt.sign(
      {
        id: user._id,
        cid: user.cid,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔄 Redirect back to frontend
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${appToken}`
    );

  } catch (err) {
    console.error("OAuth Error:", err.response?.data || err.message);
    res.status(500).json(
      err.response?.data || { error: "VATSIM OAuth failed" }
    );
  }
});

module.exports = router;