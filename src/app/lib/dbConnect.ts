import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("already connected");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }
  if (connectionState === 0) {
    console.log("No active connection, initiating connection...");
  }
  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "userDB",
      bufferCommands: false,
    });
    console.log("Connected");
  } catch (error) {
    console.log("Error in connecting to database", error);
    throw new Error("Error in connecting to database");
  }
};

export default connect;

// const connection: { isConnected?: number } = {};

// async function dbConnect() {
//   if (connection.isConnected) {
//     return;
//   }

//   const db = await mongoose.connect(process.env.MONGODB_URI!);

//   connection.isConnected = db.connections[0].readyState;
// }

// export default dbConnect;
