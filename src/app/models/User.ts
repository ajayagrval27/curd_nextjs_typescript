import mongoose, { Document, Schema, models, model } from "mongoose";

// export interface IUser extends Document {
//   firstName: String;
//   lastName: String;
//   email: String;
//   password: String;
//   gender: String;
//   hobbies: Array<1>;
// }

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  hobbies: {
    type: Array,
    required: true,
  },
});

const User = models.User || model("User", UserSchema);

// const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
