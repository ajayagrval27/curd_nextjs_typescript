import React, { FC } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addFormdata } from "../store/registrationSlice";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  hobbies?: string[];
}

const formData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: "",
  hobbies: [],
};

const RegistrationPage: FC = () => {
  const formDataArray = useSelector(
    (state: RootState) => state.registration.formData
  );
  const dispatch = useDispatch<AppDispatch>();

  console.log(formDataArray);

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    gender: yup.string().required("Gender is required"),
    hobbies: yup.array().min(2, "Select at least three hobbies"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: formData,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(addFormdata(data));
    reset();
  };

  return (
    <>
      <div className="container my-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-2/4 border-2 border-violet-500 border-opacity-70 mx-auto p-7 rounded-3xl"
        >
          <h2 className="headingColor text-4xl font-bold mb-6 text-center">
            Registration Form
          </h2>
          <div className="flex w-full gap-4 mb-5">
            <div className="w-full">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <Input
                    radius="full"
                    color="secondary"
                    type="text"
                    label="First Name"
                    defaultValue={formData.firstName}
                    isInvalid={!!errors.firstName}
                    {...field}
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    radius="full"
                    color="secondary"
                    type="text"
                    label="Last Name"
                    isInvalid={!!errors.lastName}
                    {...field}
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="mb-5">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  radius="full"
                  color="secondary"
                  type="email"
                  label="Email"
                  isInvalid={!!errors.email}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-5">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  radius="full"
                  color="secondary"
                  type="password"
                  label="Password"
                  isInvalid={!!errors.password}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-5">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  color="secondary"
                  label="Select your Gender"
                  orientation="horizontal"
                  isInvalid={!!errors.gender}
                  {...field}
                >
                  <Radio value="male">Male</Radio>
                  <Radio className="ml-2" value="female">
                    Female
                  </Radio>
                  <Radio className="ml-2" value="other">
                    Other
                  </Radio>
                </RadioGroup>
              )}
            />

            {errors.gender && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.gender.message}
              </p>
            )}
          </div>
          <div className="mb-5">
            <Controller
              name="hobbies"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  label="Select hobbies"
                  orientation="horizontal"
                  color="secondary"
                  isInvalid={!!errors.hobbies}
                  {...field}
                >
                  <Checkbox value="reading" name="hobbies">
                    reading
                  </Checkbox>
                  <Checkbox value="coding" name="hobbies">
                    Coding
                  </Checkbox>
                  <Checkbox value="playing" name="hobbies">
                    Playing
                  </Checkbox>
                  <Checkbox value="traveling" name="hobbies">
                    Traveling
                  </Checkbox>
                </CheckboxGroup>
              )}
            />
            {errors.hobbies && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.hobbies.message}
              </p>
            )}
          </div>

          <div className="mt-6">
            <Button type="submit" radius="full" color="secondary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationPage;
