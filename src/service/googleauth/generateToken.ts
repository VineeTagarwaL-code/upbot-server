import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/user";
import { config } from "../../config";
import { logger } from "../logger";
const generateToken = async (token: string) => {
  try {
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const user = await User.findOne({ email: data.email });
    let jwtToken;
    if (!user) {
      let newUser = new User({
        id: data.id,
        email: data.email,
        image: data.picture,
      });

      await newUser.save();
      jwtToken = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        config.JWT_SECRET
      );
    } else {
      jwtToken = jwt.sign(
        { userId: user._id, email: user.email },
        config.JWT_SECRET
      );
    }
    return jwtToken;
  } catch (err) {
    logger.error(`Error in verifying google auth token:${err}`);
    return;
  }
};

export { generateToken };
