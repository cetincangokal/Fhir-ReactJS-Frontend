import * as yup from 'yup';

export const validationSchema = yup.object({
  givenName: yup.string().required('Given Name is required'),
  familyName: yup.string().required('Family Name is required'),
  gender: yup.string().required('Gender is required'),
  birthDate: yup.string().required('Birth Date is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  telecoms: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.string().required('Phone Number is required'),
        use: yup.string().required('Phone Use is required'),
      })
    )
    .required('At least one Phone Number is required'),
  czNo: yup
    .string()
    .required('Identity is required')
    .matches(/^[A-Z0-9]+$/, 'Invalid Identity Format'), // Identity validation regex
});
