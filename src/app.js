import express from "express";
import path from "path";
import favicon from "serve-favicon";
import jsonfile from "jsonfile";

import sortedDatas from "./utils/sortedDatas.js";

const datas = jsonfile.readFileSync(
    path.join(process.cwd(), "src/data/datas.json")
);

sortedDatas(datas, "asc");

const PORT = 9000;
const app = express();
// création d'objets Router pour les routes d'authentification et de personnages
const authRouter = express.Router();
const characterRouter = express.Router();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

// middleware pour le favicon, les images et les css
app.use(favicon(path.join(process.cwd(), "public/assets", "favicon.ico")));
app.use(
    "/img",
    express.static(path.join(process.cwd(), "public/assets/images"))
);
app.use(
    "/css",
    express.static(path.join(process.cwd(), "public/assets/stylesheets/css"))
);
app.use("/js", express.static(path.join(process.cwd(), "public/assets/js")));

// routes middleware pour l'authentification et les personnages
app.use("/authentification", authRouter);
app.use("/liste-personnages", characterRouter);

app.get("/", (req, res) => {
    // const dataCopy = [...datas];
    // const randomCharacters = [];
    // for (let i = 3; i > 0; i--) {
    //     let index = Math.floor(Math.random() * dataCopy.length);
    //     randomCharacters.push(dataCopy[index]);
    //     dataCopy.splice(index, 1);        
    // }
    
    const indices = new Set(); // [2,4,9]
    while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * datas.length));
    }
    const randomCharacters = sortedDatas(
        Array.from(indices).map((index) => datas[index]), // datas[2], qui va se faire injecter dans un tableau et ainsi de suite pour le nombre d'éléments dans le set
        "asc"
    );
    // Array.from permet de transformer un set en tableau
    // map permet de transformer un tableau en un autre tableau
    // const randomCharacters = sortedDatas([{id: 2}, {id: 4}, {id: 9}], "asc"); 
    
    res.render("layout/main", { template: "../pages/home", randomCharacters: sortedDatas(randomCharacters, "asc")});
});

// routes des personnages
// le slash de la route est le chemin de base de la route grace au middleware characterRouter on est déjà dans la route /liste-personnages
characterRouter.get("/", (req, res) => {
    res.render("layout/main", { template: "../pages/character/list", datas });
});

characterRouter.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const characterInfo = datas.find((character) => character.id === id);
    if(!characterInfo) return res.status(404).render("layout/main", { template: "../pages/404" });
    res.render("layout/main", {
        template: "../pages/character/detail",
        characterInfo,
    });
});

// routes d'authentification
authRouter.get("/", (req, res) => {
    res.render("layout/main", { template: "../pages/auth/login" });
});

authRouter.get("/creation-de-compte", (req, res) => {
    res.render("layout/main", { template: "../pages/auth/register" });
});

// API
app.get("/api/characters", (req, res) => {
    const { name } = req.query;
    const lowerCaseName = name.toLowerCase().trim();
    const characterInfo = datas.filter((data) =>
        data.title1.toLowerCase().trim().includes(lowerCaseName)
    );
    res.json(characterInfo);
});

// pour une page not found
app.get("*", (req, res) => {
    res.status(404).render("layout/main", { template: "../pages/404" });
});

app.listen(PORT, () =>
    console.log("server running at http://localhost:" + PORT)
);
