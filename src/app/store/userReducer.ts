import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

interface ApiState {
  data: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: ApiState = {
  data: null,
  isLoading: false,
  error: null,
};

export const getData = createAsyncThunk("api/getData", async () => {
  try {
    const response = await api.get("/users");

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.message);
  }
});

export const addData = createAsyncThunk(
  "api/addData",
  async (data: FormData) => {
    try {
      const response = await api.post("/users", data);

      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.message);
    }
  }
);

export const updateData = createAsyncThunk(
  "api/updateData",
  async (data: FormData) => {
    try {
      const response = await api.patch("/users", data);

      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.message);
    }
  }
);

export const deleteData = createAsyncThunk(
  "api/deleteData",
  async (id: string) => {
    try {
      const response = await api.delete("/users", { data: { _id: id } });

      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.message);
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "api",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(addData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(addData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default userSlice.reducer;
