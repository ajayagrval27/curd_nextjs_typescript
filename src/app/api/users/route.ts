import connect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find({});

    const statusCode = users.length > 0 ? 200 : 204;

    return NextResponse.json({ users, statusCode });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Error in fetching users" + error, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connect();
    const newUser = new User(body);
    await newUser.save();

    return NextResponse.json(
      { massage: "User is created", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Error in fetching users" + error, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, gender, hobbies, _id } = body;

    console.log(body);
    await connect();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !hobbies ||
      !_id
    ) {
      return NextResponse.json(
        {
          message: "All fields required",
        },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(_id)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        gender: gender,
        hobbies: hobbies,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    const { _id } = body;
    console.log(_id);

    if (!_id) {
      return NextResponse.json(
        { message: "User id required" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(_id)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(_id));

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted Successfully", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting user", error },
      { status: 500 }
    );
  }
};
