import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "YOUR_POSTGRESQL_PASSWORD",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let users = [{id: 1, name: "Angela"}, {id: 2, name: "Jack"}];
let items = [];
let currentUserId = users[0].id;
let currentListType = "daily";


app.get("/", (req, res) => {
  res.redirect("/todo/daily");
});


app.get("/todo/:listType", (req, res) => {
  currentListType = req.params.listType;

  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
    }else {
      users = result.rows;
    }
  });

  db.query("SELECT * FROM list_items ORDER BY id ASC", (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
    }else {
      items = result.rows;
    }
  });

  let itemsToSend = [];

  items.forEach(item => {
    if(item.user_id === currentUserId && item.item_type === currentListType) {
      itemsToSend.push(item);
    }
  });

  res.render("index.ejs", {currentListType: currentListType, users: users, listItems: itemsToSend, listTitle: `${users.find(user => user.id === currentUserId).name}'s todo list`});
});


app.get("/user/:id/:listType", (req, res) => {
  currentUserId = parseInt(req.params.id);
  currentListType = req.params.listType;
  res.redirect("/");
})


app.post("/add", (req, res) => {
  console.log(req.body);
  db.query("INSERT INTO list_items(title, user_id, item_type) VALUES ($1, $2, $3)", [req.body.newItem, currentUserId, currentListType], (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
    }else {
      console.log(`${req.body.newItem} added successfully`);
    }
  });
  res.redirect("/");
});


app.post("/edit", (req, res) => {
  console.log(req.body);
  db.query("UPDATE list_items SET title = $1 WHERE id = $2", [req.body.updatedItemTitle, parseInt(req.body.updatedItemId)], (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
    }else {
      console.log(`Updated successfully`);
    }
  });
  res.redirect("/");
});


app.post("/delete", (req, res) => {
  console.log(req.body);
  db.query("DELETE FROM list_items WHERE id = $1", [parseInt(req.body.deleteItemId)], (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
    }else {
      console.log(`Deleted successfully`);
    }
  });
  res.redirect("/");
});


app.get("/user/add", (req, res) => {
  res.render("addUser.ejs", {sentence: "Name:"});
})


app.post("/user/add", (req, res) => {
  if (req.body.name.trim() === "") {
    res.render("addUser.ejs", {sentence: "Please enter a name"});
  }else {
    db.query("INSERT INTO users(name) VALUES ($1)", [req.body.name], (err, result) => {
      if (err) {
      console.error("Error executing query", err.stack);
      res.render("addUser.ejs", {sentence: "Please enter a name"});
    }else {
        console.log(`${req.body.name} added successfully`);
        res.redirect("/");
      }
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
