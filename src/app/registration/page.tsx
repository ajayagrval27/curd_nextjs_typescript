import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  CircularProgress,
  Input,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
// import { addFormdata } from "../store/registrationSlice";
import { addData, deleteData, getData, updateData } from "../store/userReducer";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  hobbies?: string[];
}

let formData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: "",
  hobbies: [],
};

const RegistrationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDataId, setEditDataId] = useState("");

  useEffect(() => {
    dispatch(getData()).then((res: any) => {
      if (res.meta.requestStatus === "fulfilled") {
        setUsersData(res.payload.users);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (loading) {
      dispatch(getData()).then((res: any) => {
        if (res.meta.requestStatus === "fulfilled") {
          setUsersData(res.payload.users);
          setLoading(false);
        }
      });
    }
  }, [loading]);

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
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (!!editDataId) {
      const editObj = {
        ...data,
        _id: editDataId,
      };
      console.log(editObj);
      await dispatch(updateData(editObj));
      setEditDataId("");
    } else {
      await dispatch(addData(data));
    }

    // Reset form fields manually
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("password", "");
    setValue("gender", "");
    setValue("hobbies", []);

    setLoading(true);
  };

  // const onSubmit = async (data: any) => {
  //   if (!!editDataId) {
  //     const editObj = {
  //       ...data,
  //       _id: editDataId,
  //     };
  //     console.log(editObj);
  //     dispatch(updateData(editObj));
  //     setEditDataId("");
  //   } else {
  //     console.log(data);
  //     dispatch(addData(data));
  //   }
  //   reset();
  //   setLoading(true);
  // };

  const handleEdit = (data: any, id: string) => {
    if (data._id) {
      setEditDataId(id);
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("email", data.email);
      setValue("password", data.password);
      setValue("gender", data.gender);
      setValue("hobbies", data.hobbies);
    } else {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("email", "");
      setValue("password", "");
      setValue("gender", "");
      setValue("hobbies", []);
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteData(id));
    setLoading(true);
  };

  const columns: GridColDef<any>[] = [
    {
      field: "fullName",
      headerName: "Full name",
      flex: 0.5,
      renderCell: (params) => (
        <>{`${params.row.firstName || ""} ${params.row.lastName || ""}`}</>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.7,
      renderCell: (params) => <>{params.row.email}</>,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0.5,
    },
    {
      field: "hobbies",
      headerName: "Hobbies",
      flex: 0.6,
      renderCell: (params: any) => <>{params.row.hobbies.join(", ")}</>,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.6,
      renderCell: (params: any) => (
        <>
          <div className="flex gap-3">
            <Button
              radius="full"
              color="primary"
              onClick={() => handleEdit(params.row, params.row._id)}
            >
              Edit
            </Button>
            <Button
              radius="full"
              color="danger"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </Button>
          </div>
        </>
      ),
    },
  ];

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

          <div className="mt-6 flex gap-4">
            <Button type="submit" radius="full" color="secondary">
              Submit
            </Button>
            <Button
              onClick={() => reset()}
              type="reset"
              radius="full"
              color="primary"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      <div className="container my-10">
        <Box sx={{ height: 631, width: "80%", m: "auto" }}>
          <DataGrid
            sx={{
              "& .MuiDataGrid-columnHeader": {
                paddingLeft: "15px",
                fontSize: 17,
                fontWeight: 700,
              },
              "& .MuiDataGrid-cell": {
                paddingLeft: "15px",
              },
            }}
            loading={loading}
            rows={usersData && usersData}
            columns={columns && columns}
            getRowId={(row) => {
              return row._id;
            }}
            slots={{
              loadingOverlay: () => (
                <CircularProgress
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    maxWidth: "100%",
                    backdropFilter: "blur(2px)",
                  }}
                />
              ),
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        </Box>
        {/* {usersdata.length > 0 &&
          usersdata.map((formDataItem: any, index: any) => {
            return (
              <Card key={index} className="max-w-[340px] m-2">
                <CardHeader className="flex">
                  <h2 className="font-bold text-xl">User Data</h2>
                </CardHeader>
                <Divider />
                <CardBody className="py-2">
                  <p>{`Name : ${formDataItem?.firstName} ${formDataItem?.lastName}`}</p>
                </CardBody>
                <Divider />
                <CardBody className="py-2">
                  <p>{`Email : ${formDataItem?.email}`}</p>
                </CardBody>
                <Divider />
                <CardBody className="py-2">
                  <p>{`Gender : ${formDataItem?.gender}`}</p>
                </CardBody>
                <Divider />
                <CardBody className="py-2">
                  <p>{`Hobbies : ${formDataItem?.hobbies?.join(", ")}`}</p>
                </CardBody>
              </Card>
            );
          })} */}
      </div>
    </>
  );
};

export default RegistrationPage;
