import * as yup from 'yup';

export const validationSchema = yup.object({
  givenName: yup.string().required('Given Name is required'),
  familyName: yup.string().required('Family Name is required'),
  gender: yup.string().required('Gender is required'),
  birthDate: yup.string().required('Birth Date is required'),
  address: yup.string().required('Address is required'),
  telecoms: yup.array().of(
    yup.object().shape({
      value: yup
        .string()
        .required('Phone Number is required')
        .matches(/^\d{10}$/, 'Phone Number must be a valid 10-digit number'), // Use regex for phone number validation
      use: yup.string().required('Phone Use is required'),
    })
  ),
});
