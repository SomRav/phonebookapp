require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("body", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else return "";
});

app.use(
  morgan(
    "morgan(':method :url :status :res[content-length] - :response-time ms :body')"
  )
);

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

const Person = require("./model/person");

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    const errorMessage =
      body.name || body.number
        ? body.name
          ? "number missing"
          : "name missing"
        : "name and number missing";
    return response.status(400).json({
      error: errorMessage,
    });
  }

  // const nameExist = persons.some((p) => p.name === body.name);

  Person.find({}).then((persons) => {
    const nameExist = persons.some((p) => p.name === body.name);
    if (nameExist) {
      return response.status(400).json({ error: "name must be unique" });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  });
});

app.get("/info", (request, response) => {
  const timeOfReuest = new Date();
  Person.find({}).then((persons) => {
    const infoHtml = `
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${String(timeOfReuest)}</p>
    `;
    return response.send(infoHtml);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((note) => {
    note ? response.json(note) : response.status(404).end();
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then((deletedPerson) => {
    if (deletedPerson) {
      return response.status(204).end();
    } else {
      return request.status(404).end();
    }
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on : https://localhost:${PORT}/`);
});
