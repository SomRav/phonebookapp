require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.static("dist"));
app.use(express.json());

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

const Person = require("./model/person");

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response, next) => {
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

    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => next(error));
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

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((note) => {
      note ? response.json(note) : response.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        return response.status(204).end();
      } else {
        return request.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      person.number = number;
      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "Are you lost Baby girl?" });
};
app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  // console.error(error.message);
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on : https://localhost:${PORT}/`);
});
