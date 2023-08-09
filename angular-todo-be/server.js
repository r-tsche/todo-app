const http = require("http");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const secretKey = "1234567";
let users = [];

fs.readFile("./data/users.json", "utf8", (err, data) => {
  if (!err) {
    users = JSON.parse(data);
  }
});

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    const { pathname, query } = url.parse(req.url);
    const queryParams = querystring.parse(query);

    function authenticate(req, res, next) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return resError(res, 401, "Unauthorized");
      }

      const token = authHeader.split(" ")[1];
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return resError(res, 401, "Token expired or invalid");
        }
        req.user = decoded;
        next();
      });
    }

    if (pathname === "/login" && req.method === "POST") {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => {
        const { username, password } = JSON.parse(data);
        const user = users.find((user) => user.username === username);
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return resError(res, 401, "Invalid credentials");
        }
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: "1h" }
        );
        resSuccess(res, { token });
      });
    } else if (pathname === "/signup" && req.method === "POST") {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => {
        const { username, password } = JSON.parse(data);
        const hashedPassword = bcrypt.hashSync(password, 10);
        if (users.some((user) => user.username === username)) {
          return resError(res, 400, "Username is already taken");
        }
        const newUser = {
          id: users.length + 1,
          username,
          password: hashedPassword,
        };
        users.push(newUser);
        fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
          if (err) {
            return resError(res, 500, "Error saving user data");
          }
          resSuccess(res, "User created successfully");
        });
      });
    } else if (pathname === "/todoList" && req.method === "GET") {
      authenticate(req, res, () => {
        readDataFile("./data/todos.json", res, (todos) => {
          resSuccess(res, todos);
        });
      });
    } else if (pathname.startsWith("/todoList/") && req.method === "GET") {
      const itemId = pathname.split("/").pop();
      readDataFile("./data/todos.json", res, (todos) => {
        const todoList = todos.find((list) => list.id === itemId);
        if (todoList) {
          resSuccess(res, { title: todoList.title, items: todoList.items });
        } else {
          resError(res, 404, "Todo list not found");
        }
      });
    } else if (pathname.startsWith("/todoList/") && req.method === "POST") {
      const listId = pathname.split("/").pop();
      readRequestBody(req, (newItem) => {
        readDataFile("./data/todos.json", res, (todos) => {
          const todoList = todos.find((list) => list.id === listId);
          if (todoList) {
            todoList.items.push(newItem);
            writeDataFile("./data/todos.json", todos, res, () => {
              resSuccess(res, newItem);
            });
          } else {
            resError(res, 404, "Todo list not found");
          }
        });
      });
    } else if (pathname.startsWith("/todoList/") && req.method === "PUT") {
      const listId = pathname.split("/").pop();
      readRequestBody(req, (updatedItem) => {
        readDataFile("./data/todos.json", res, (todos) => {
          const todoList = todos.find((list) => list.id === listId);
          if (todoList) {
            const itemIndex = todoList.items.findIndex(
              (item) => item.id === updatedItem.id
            );
            if (itemIndex !== -1) {
              todoList.items[itemIndex] = updatedItem;
              writeDataFile("./data/todos.json", todos, res, () => {
                resSuccess(res, updatedItem);
              });
            } else {
              resError(res, 404, "Todo item not found");
            }
          } else {
            resError(res, 404, "Todo list not found");
          }
        });
      });
    } else if (pathname.startsWith("/todoList/") && req.method === "DELETE") {
      const listId = pathname.split("/")[2]; // Extract the list ID from the URL
      const itemId = pathname.split("/")[3]; // Extract the item ID from the URL

      if (itemId) {
        readDataFile("./data/todos.json", res, (todos) => {
          const todoList = todos.find((list) => list.id === listId);
          if (todoList) {
            const itemIndex = todoList.items.findIndex(
              (item) => item.id === itemId
            );
            if (itemIndex !== -1) {
              todoList.items.splice(itemIndex, 1);
              writeDataFile("./data/todos.json", todos, res, () => {
                resSuccess(res, "Todo item deleted successfully");
              });
            } else {
              resError(res, 404, "Todo item not found");
            }
          } else {
            resError(res, 404, "Todo list not found");
          }
        });
      } else {
        readDataFile("./data/todos.json", res, (todos) => {
          const listIndex = todos.findIndex((list) => list.id === listId);
          if (listIndex !== -1) {
            todos.splice(listIndex, 1);
            writeDataFile("./data/todos.json", todos, res, () => {
              resSuccess(res, "Todo list deleted successfully");
            });
          } else {
            resError(res, 404, "Todo list not found");
          }
        });
      }
    } else if (pathname === "/todoList" && req.method === "POST") {
      readRequestBody(req, (newList) => {
        readDataFile("./data/todos.json", res, (todos) => {
          const newListWithItems = { ...newList, items: [] };
          todos.push(newListWithItems);
          writeDataFile("./data/todos.json", todos, res, () => {
            resSuccess(res, "Todo list created successfully");
          });
        });
      });
    } else {
      resError(res, 404, "Route not found");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function resError(res, status, message) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message }));
}

function resSuccess(res, data) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readDataFile(filePath, res, callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      resError(res, 500, "Internal server error");
    } else {
      callback(JSON.parse(data));
    }
  });
}

function readRequestBody(req, callback) {
  let data = "";
  req.on("data", (chunk) => (data += chunk.toString()));
  req.on("end", () => {
    try {
      const parsedData = JSON.parse(data);
      callback(parsedData);
    } catch (error) {
      resError(res, 400, "Invalid JSON data");
    }
  });
}

function writeDataFile(filePath, data, res, callback) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      resError(res, 500, "Internal server error");
    } else {
      callback();
    }
  });
}
