import express from "express"; // get express
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017/";

//console.log("132")

const port = 5500;
const app = express();

const __filename = fileURLToPath(import.meta.url); // get path to app.js
const __dirname = path.dirname(__filename); // path to app.js whithout app.js
//app.use(express.static(path.join(__dirname, "")))
console.log(__dirname);

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.resolve(__dirname, "./views/layouts"),
    partialsDir: path.resolve(__dirname, "./views/partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "../dist")));

app.get("/", (req, res) => {
  res.render("pages/home", { layout: "main" });
});
const parser = express.urlencoded({ extended: false });
app.post("/", parser, (req, res) => {
  let date = req.body.date;
  let upper = req.body.upper;
  let lower = req.body.lower;
  let pulse = req.body.pulse;
  let weight = req.body.weight;

  async function run() {
    try {
      const client = new MongoClient(uri);
      const database = client.db("arPress");
      const movies = database.collection("measurements");
      let k = {
        date: date,
        upper: upper,
        lower: lower,
        pulse: pulse,
        weight: weight,
      };
      await movies.insertOne(k);
      console.log("qwq");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

  res.render("pages/home", { layout: "main" });
});

app.get("/all", (req, res) => {

	
	
	  async function run() {
    try {
      const client = new MongoClient(uri);
      const database = client.db("arPress");
      const movies = database.collection("measurements");
      let movie = await movies.find().sort({ date: -1 }).toArray();
		//console.log(movie)

        res.render("pages/all", { layout: "main", m: movie });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);



});

/* ---- */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
