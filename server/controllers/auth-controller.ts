import { User } from "../models";
import { Auth } from "../models/auth";
import * as crypto from "crypto";
import * as jtw from "jsonwebtoken";

type NewUser = {
  email: string;
  password: string;
  name: string;
};
type UserData = {
  email: string;
  password: string;
};

const SECRET = process.env.SECRET;
function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
export async function getUserProfile(userId: number) {
  const user = await User.findByPk(userId);

  if (user) {
    return user;
  } else {
    throw "problemas en un user controller";
  }
}
export async function checkUser(email: string) {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
}
export async function createUser(newUser: NewUser) {
  const [user, created] = await User.findOrCreate({
    where: {
      email: newUser.email,
    },
    defaults: {
      ...newUser,
    },
  });
  const [auth, authCreated] = await Auth.findOrCreate({
    where: {
      user_id: user.get("id"),
    },
    defaults: {
      email: newUser.email,
      password: getSHA256ofString(newUser.password),
      user_id: user.get("id"),
    },
  });
  return user;
}

export async function updateUser(userId, newData) {
  const { name, password } = newData;
  const auth = await Auth.update(
    { password: getSHA256ofString(password) },
    {
      where: {
        id: userId,
      },
    }
  );
  const user = await User.update(
    { name },
    {
      where: {
        id: userId,
      },
    }
  );
  return user;
}

export async function getToken(UserData: UserData) {
  const auth = await Auth.findOne({
    where: {
      email: UserData.email,
      password: getSHA256ofString(UserData.password),
    },
  });

  if (auth) {
    const token = jtw.sign({ id: auth.get("user_id") }, SECRET);
    return token;
  } else {
    return false;
  }
}
