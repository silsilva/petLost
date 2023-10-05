import "dotenv/config";
import * as cors from "cors";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { sequelize } from "./models/db";
import {
  checkUser,
  createUser,
  getToken,
  updateUser,
  getUserProfile,
    createAuth,
  authId,
} from "./controllers/auth-controller";

import {
  deletePet,
  getPet,
  getUserPets,
  modifyPet,
  reportPet,
  searchPetsAround,
} from "./controllers/pets-controller";

const app = express();
const port = 3000;
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);
// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });
const SECRET = process.env.SECRET;
const frontEndPath = path.resolve(__dirname, "../dist");
function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

//authorization middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch {
    res.status(401).json({ error: "middleware" });
  }
}
//check user email
app.post("/check", async (req, res) => {
  console.log("checking");

  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      message: "el request debe incluir un email",
    });
  }
  const userExist = await checkUser(email);
  res.json({
    user: userExist,
  });
});
//sign up
app.post("/auth", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const newUser = await createUser(name, email);
    const userId = await newUser.user.get("id");
    const passwordHashed = getSHA256ofString(password);
    const newAuth = await createAuth(userId, email, passwordHashed);

    res.json(newUser);
  } catch (error) {
    res.send({ error });
  }
});
//obtener token de usuario registrado
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const passwordHasheado = getSHA256ofString(password);
  const auth = await authId(email, passwordHasheado);
  if (auth !== null) {
    const token = jwt.sign({ id: auth.get("user_id") }, SECRET);
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: "User or Password incorrecto" });
  }
});
//get user data
app.get("/me", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const userProfile = await getUserProfile(userId);
  res.json(userProfile);
});

//modify el password
app.put("/me", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const userUpdated = await updateUser(userId, req.body);
  res.json(userUpdated);
});
//
//
//
//
//report new pet
app.post("/pets", authMiddleware, async (req, res) => {
  const { name, pictureUrl, lat, lng, zone } = req.body;
  const userId = req._user.id;
  const pet = await reportPet(userId, {
    zone,
    name,
    pictureUrl,
    lat,
    lng,
  });
  res.json(pet);
});
//modify pet by id
app.put("/pets/:id", authMiddleware, async (req, res) => {
  const pet = await modifyPet(req.body, req.params.id);
  res.json(pet);
});
//get pet data by id
app.get("/pets/:id", authMiddleware, async (req, res) => {
  const pet = await getPet(req.params.id).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(pet);
});
//delete pet data by id
app.delete("/pets/:id", authMiddleware, async (req, res) => {
  const pet = await deletePet(req.params.id);
  res.json(pet);
});
//get all user pets
app.get("/me/pets", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const pets = await getUserPets(userId);

  res.json(pets);
});

//get all pets around
app.get("/pets-around", async (req, res) => {
  const { lat, lng } = req.query;
  const lostPets = await searchPetsAround(lat, lng);
  res.json(lostPets);
});

app.use(express.static(path.resolve(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
