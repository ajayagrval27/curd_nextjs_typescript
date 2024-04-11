import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  hobbies?: string[];
}

interface FormState {
  formData: FormData[];
}

const initialState: FormState = {
  formData: [],
};

const registrationSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    addFormdata(state, action: PayloadAction<FormData>) {
      state.formData.push({ ...action.payload });
    },
  },
});

export const { addFormdata } = registrationSlice.actions;
export default registrationSlice.reducer;
