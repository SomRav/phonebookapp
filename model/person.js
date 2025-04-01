const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

url = process.env.MONGODB_URI;

console.log("Connecting to url.....");
mongoose
  .connect(url)
  .then((result) => {
    console.log("Sucsessfully Connected to DB");
  })
  .catch((error) => {
    console.log("Failed Connecting To DB", error.message);
  });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
