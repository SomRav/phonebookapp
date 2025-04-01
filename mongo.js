const mongoose = require("mongoose");

if (process.argv.length === 3) {
  const password = process.argv[2];

  const url = `mongodb+srv://soumyachakra004:${password}@notesapp.s5pc5ju.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=NotesApp`;

  mongoose.set("strictQuery", false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  Person.find({}).then((result) => {
    console.log("PhoneBook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const password = process.argv[2];
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const url = `mongodb+srv://soumyachakra004:${password}@notesapp.s5pc5ju.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=NotesApp`;

  mongoose.set("strictQuery", false);

  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  person.save().then((result) => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("give password, name and number to be added as argument");
  process.exit(1);
}
