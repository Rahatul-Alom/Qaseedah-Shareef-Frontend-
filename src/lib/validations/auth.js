import * as yup from "yup";

// Register Validation Schema
export const registerValidation = yup.object({
  email: yup
    .string()
    .email("Must be a valid email.") 
    .required("Email is required."),
  password: yup
    .string()
    .min(3, "Minimum 3 characters.")
    .max(250, "Maximum 250 characters.")
    .required("Password is required."),
  name: yup
    .string()
    .trim()
    .min(3, "Minimum 3 characters.")
    .max(50, "Maximum 50 characters.")
    .matches(/^[^@]+$/, "Name should not contain '@' symbol.")
    .required("Name is required."),
});

// Login Validation Schema
export const loginValidation = yup.object({
  email: yup
    .string()
    .trim()
      .matches(/^(?!@)[^\s]+(?<!@)$/, "Invalid email or name")
      .required(),

  password: yup
    .string()
    .min(3, "Minimum 3 characters.")
    .max(250, "Maximum 250 characters.")
    .required("Password is required."),
});

// Forgot Password Create Validation Schema
export const forgetPassCreateValidation = yup.object({
  email: yup
    .string()
    .trim()
      .matches(/^(?!@)[^\s]+(?<!@)$/, "Invalid email or name")
      .required("Email is required."),
  })
  .required();

export const forgetPassResetValidation = yup
  .object({
    email: yup
      .string()
      .trim()
      .matches(/^(?!@)[^\s]+(?<!@)$/, "Invalid email or name")
      .required(),
  password: yup
    .string()
    .min(3, "Minimum 3 characters.")
    .max(250, "Maximum 250 characters.")
    .required("Password is required."),
});
