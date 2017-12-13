const mongoose     = require('mongoose');

const signupSchema = new mongoose.Schema({
  username            : { type: String, required: true },
  product             : { type: String, required: true },
  coast               : { type: String, required: true },
  successful          : { type: Boolean, required: true },
  holiday             : { type: String, requried: true}
});
const Signup       = mongoose.model('Signup', signupSchema);
module.exports     = Signup;
