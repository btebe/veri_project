import { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import axios from "axios";
const Register = () => {
  let history = useHistory();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 615px)" });

  const showToggle = () => setShow((prev) => !prev);
  const initialdata = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
//http://localhost:3001/api/users
  const onSubmitForm = async (data) => {
    try {
      setLoading(true);
      await axios.post("https://veri-project-heroku.herokuapp.com/api/users", data).then((res) => {
        setLoading(false);
        setMessage(res.data.message);
      });
    } catch (err) {
      if (
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setLoading(false);
        setError(err.response.data.message);
      }
    }
  };
  const validateScheme = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "first name must be at least 3 characters")
      .required("first name required"),
    lastName: Yup.string()
      .min(3, "last name must be at least 3 characters")
      .required("last name required"),
    email: Yup.string()
      .email("invalid email format")
      .required("email required"),
    password: Yup.string()
      .min(8)
      .required("password required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "weak password!! needs at least one: small letter, capital letter, number and special character."
      ),
  });
  return (
    <div className={styles.register_container}>
      <div className={styles.register_form_container}>
        <div className={styles.register_form_left}>
          <h1 style={{ color: "white" }}> Welcome!</h1>
          <button className={styles.btn} onClick={() => history.push("/login")}>
            Login
          </button>
        </div>
        <div className={styles.register_form_right}>
          <div className={styles.form_container}>
            <h1>Create your Account</h1>
            <Formik
              initialValues={initialdata}
              onSubmit={onSubmitForm}
              validationSchema={validateScheme}
            >
              <Form className={styles.form_container}>
                <ErrorMessage
                  name='firstName'
                  component='span'
                  render={(msg) => <span className={styles.error}>{msg}</span>}
                />
                <Field
                  id='inputFirstname'
                  name='firstName'
                  placeholder='First Name'
                  className={styles.input}
                />
                <ErrorMessage
                  name='lastName'
                  component='span'
                  render={(msg) => <span className={styles.error}>{msg}</span>}
                />
                <Field
                  id='inputLastname'
                  name='lastName'
                  placeholder='Last Name'
                  className={styles.input}
                />
                <ErrorMessage
                  name='email'
                  component='span'
                  render={(msg) => <span className={styles.error}>{msg}</span>}
                />
                <Field
                  id='inputEmail'
                  name='email'
                  placeholder='Email'
                  className={styles.input}
                  autoComplete='off'
                />
                <ErrorMessage
                  name='password'
                  component='span'
                  render={(msg) => <span className={styles.error}>{msg}</span>}
                />
                <div className={styles.inputIcons}>
                  <i
                    className={
                      show
                        ? `fa fa-eye fa-lg ${styles.icon}`
                        : `fa fa-eye-slash fa-lg ${styles.icon}`
                    }
                    onClick={showToggle}
                  />
                  <Field
                    id='inputPassword'
                    name='password'
                    placeholder='password'
                    className={styles.input}
                    type={show ? "text" : "password"}
                    autoComplete='off'
                  />
                </div>

                {loading && <p className={styles.load}>Loading...</p>}
                {error && <p className={styles.errorMsg}>{error}</p>}
                {message && <p className={styles.message}>{message}</p>}
                <button type='submit' className={styles.btn}>
                  Register
                </button>
              </Form>
            </Formik>

            {isTabletOrMobile && (
              <div className={styles.mobile_reg}>
                <p>or</p>
                <button
                  className={styles.btn}
                  onClick={() => history.push("/login")}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
