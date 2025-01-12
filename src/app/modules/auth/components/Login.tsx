import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../core/Auth';
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import { login/*, getUserByToken*/ } from '../core/_requests';

// Define types for the auth response and user
// interface AuthResponse {
//   token: string;
// }

interface UserResponse {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface UserModel {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
}

// Mock functions for testing purposes
// const mockLogin = (email: string, password: string): Promise<{ data: AuthResponse }> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           token: 'mock-token-123456',
//         },
//       });
//     }, 500); // Simulating a delay for async call
//   });
// };

 const mockGetUserByToken = (token: string): Promise<{ data: UserResponse }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: 1,
          name: 'Test User',
          email: 'testuser@email.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });
    }, 500);
  });
};

//Define the mapping function to convert UserResponse to UserModel
const handleUserMapping = (userResponse: UserResponse): UserModel => {
  return {
    id: userResponse.id, // Mapping 'id' from response
    username: userResponse.name, // Mapping 'name' from response to 'username'
    password: 'defaultPassword', // Set a default or derived password
    first_name: userResponse.first_name,
    last_name: userResponse.last_name,
    email: userResponse.email,
  };
};

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
});

const initialValues = {
  email: 'theo13@gmail.com',
  password: 'password012',
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const { saveAuth, setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log('Submitting form with values:', values); // For testing
      try {
        // Perform login
        const authResponse = await login(values.email, values.password);
        const auth = authResponse.data;
        console.log('Login successful, auth:', auth); // Testing auth response
        saveAuth(auth); // Save the token to localStorage

        // Get user details using the token
        //const userResponse = await getUserByToken(auth.token);
        //console.log('Mapped user:', userResponse.data);
        //setCurrentUser(userResponse.data); // Save user data to context/state
        const userResponse = await mockGetUserByToken('mock-token-123456');
        const user = handleUserMapping(userResponse.data); // Mapping UserResponse to UserModel
        console.log('Mapped user:', user);

        setCurrentUser(user); // Setting the mapped user model
        // No need to redirect here, PrivateRoutes will handle it
      } catch (error) {
        console.error('Login error:', error);
        setStatus('Invalid login details'); // Show error message to user
        setSubmitting(false);
        saveAuth(undefined);
      } finally {
        setLoading(false);
      }
      // console.log('Submitting form with values:', values); // For testing

      // try {
      //   // Use the mock login function instead of the actual API call
      //   const authResponse = await mockLogin(values.email, values.password);
      //   const auth = authResponse.data;
      //   console.log('Login successful, mock auth:', auth); // Testing mock auth response

      //   saveAuth(auth);

      //   // Use the mock user retrieval function instead of the actual API call
      //   const userResponse = await mockGetUserByToken(auth.token);
      //   const user = handleUserMapping(userResponse.data); // Mapping UserResponse to UserModel
      //   console.log('Mapped user:', user);

      //   setCurrentUser(user); // Setting the mapped user model
      //   // No need to redirect here, PrivateRoutes will handle it
      // } catch (error) {
      //   console.error('Login error:', error);
      //   saveAuth(undefined);
      //   setStatus('The login detail is incorrect');
      //   setSubmitting(false);
      //   setLoading(false);
      // }
    },
  });

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Sign In</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          New Here?{' '}
          <Link to='/auth/registration' className='link-primary fw-bolder'>
            Create an Account
          </Link>
        </div>
      </div>
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            { 'is-valid': formik.touched.email && !formik.errors.email }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>

      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
            <Link to='/auth/forgot-password' className='link-primary fs-6 fw-bolder'>
              Forgot Password ?
            </Link>
          </div>
        </div>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.password && formik.errors.password },
            { 'is-valid': formik.touched.password && !formik.errors.password }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>

        <div className='text-center text-muted text-uppercase fw-bolder mb-5'>or</div>

        <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
            className='h-20px me-3'
          />
          Continue with Google
        </a>
      </div>
    </form>
  );
}
