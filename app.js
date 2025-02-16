const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const os = require("os");
const session = require("express-session"); // Ajout de express-session
const router = express.Router();

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.DB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getWifiIP = () => {
  const interfaces = os.networkInterfaces();
  return (
    (interfaces["Wi-Fi"] &&
      interfaces["Wi-Fi"].find((i) => i.family === "IPv4")?.address) ||
    "localhost"
  );
};

// Configuration de express-session
app.use(
  session({
    secret: "votre_secret_key", // Clé secrète pour signer la session
    resave: false, // Ne pas sauvegarder la session si elle n'est pas modifiée
    saveUninitialized: true, // Sauvegarder une session même si elle est vide
    cookie: { secure: false }, // `secure: true` nécessite HTTPS
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

(async () => {
  try {
    await mongoose.connect(url, options);
    console.log("Connecté à MongoDB avec succès");

    // await mongoose.connection.db
    //   .collection("users")
    //   .deleteMany({ email: null });
    // console.log("Nettoyage des documents avec email: null terminé.");

    const iplocal = getWifiIP();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Votre serveur est disponible sur http://${iplocal}:${port}`);
    });
  } catch (error) {
    console.log("Erreur de connexion à la base de données", error);
  }
})();

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
    },
    usermail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v && v.includes("@") && v.includes(".");
        },
        message: (props) => `${props.value} n'est pas un email valide !`,
      },
    },
    userpassword: {
      type: String,
      required: true,
    },
    preferences: {
      type: Object,
      default: {},
    },
    historique_voyages: {
      type: Array,
      default: [],
    },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

app.post("/adduser", async (req, res) => {
  const { pseudo, usermail, userpassword, preferences, historique_voyages } =
    req.body;

  console.log("Tentative d'ajout d'utilisateur avec usermail :", usermail);

  if (!usermail || !usermail.includes("@") || !usermail.includes(".")) {
    return res.status(400).json({ message: "Email invalide" });
  }

  try {
    const existingUser = await User.findOne({ usermail });
    if (existingUser) {
      console.log("Email déjà utilisé :", usermail);
      return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    const newUser = new User({
      pseudo,
      usermail,
      userpassword,
      preferences,
      historique_voyages,
    });

    await newUser.save();

    console.log("Utilisateur ajouté avec succès :", newUser);
    res.status(201).json({
      message: "Utilisateur ajouté avec succès",
      pseudo: newUser.pseudo,
      usermail: newUser.usermail,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    res.status(500).send("Erreur lors de l'ajout de l'utilisateur");
  }
});

app.post("/signin", async (req, res) => {
  const { pseudo, userpassword } = req.body;

  try {
    const user = await User.findOne({ pseudo });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Pseudo ou mot de passe incorrect." });
    }

    if (userpassword !== user.userpassword) {
      return res
        .status(400)
        .json({ message: "Pseudo ou mot de passe incorrect." });
    }

    // Créer une session pour l'utilisateur
    req.session.user = {
      pseudo: user.pseudo,
      usermail: user.usermail,
    };

    // Renvoyer les informations de l'utilisateur au front-end
    res.status(200).json({
      message: "Connexion réussie !",
      user: {
        pseudo: user.pseudo,
        usermail: user.usermail,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
});

app.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la déconnexion." });
    }
    res.status(200).json({ message: "Déconnexion réussie !" });
  });
});

module.exports = {
  User,
};
const destinationSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    pays: { type: String, required: true },
    description: { type: String, required: true },
    meteo: { type: Object, default: {} },
    attractions: { type: [String], default: [] },
    budget_estime: { type: Number, required: true },
  },
  { collection: "destinations" }
);

const Destination = mongoose.model("Destination", destinationSchema);

// Ajouter une destination
app.post("/adddestination", async (req, res) => {
  try {
    const { nom, pays, description, attractions, budget_estime } = req.body;
    const newDestination = new Destination({
      nom,
      pays,
      description,
      attractions,
      budget_estime,
    });
    await newDestination.save();
    res.status(201).json({
      message: "Destination ajoutée avec succès",
      destination: newDestination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'ajout de la destination");
  }
});

// Récupérer toutes les destinations
app.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des destinations");
  }
});

// Récupérer une destination par ID
app.get("/destination/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination non trouvée" });
    }
    res.status(200).json(destination);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de la destination");
  }
});

// Rechercher une destination par nom ou pays
app.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const results = await Destination.find({
      $or: [
        { nom: { $regex: query, $options: "i" } },
        { pays: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la recherche de destination");
  }
});

module.exports = router;
