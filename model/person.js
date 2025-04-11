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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It must be in the format XX-XXXXXXX or XXX-XXXXXXXX.`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
