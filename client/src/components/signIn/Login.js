import { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import axios from "axios";

function Login() {
  let history = useHistory();
  const [show, setShow] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 615px)" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialdata = {
    email: "",
    password: "",
  };
  const showToggle = () => setShow((prev) => !prev);

  //http://localhost:3001/api/auth
  const onSubmitForm = async (data) => {
    setLoading(true);
    try {
      await axios.post("https://veri-project-heroku.herokuapp.com/api/auth", data).then((res) => {
        setLoading(false);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        window.location = "/";
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
    email: Yup.string()
      .email("invalid email format")
      .required("email required"),
    password: Yup.string().min(8).required("password required"),
  });

  return (
    <div className={styles.login_conatiner}>
      <div className={styles.login_form_container}>
        <div className={styles.login_form_left}>
          <div className={styles.form_container}>
            <h1>Login to your account</h1>

            <Formik
              initialValues={initialdata}
              onSubmit={onSubmitForm}
              validationSchema={validateScheme}
            >
              <Form className={styles.form_form_container}>
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

                <button className={styles.btn} type='submit'>
                  Sign In
                </button>
                <p className={styles.forgot}>
                  or
                  <span onClick={() => history.push("/req-password-reset/")}>
                    Forgot?
                  </span>
                </p>
              </Form>
            </Formik>
            {isTabletOrMobile && (
              <div className={styles.mobile_login}>
                <p>New here?</p>
                <button
                  className={styles.btn}
                  onClick={() => history.push("/signup")}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.login_form_right}>
          <h1 style={{ color: "white" }}>New Here?</h1>
          <button
            className={styles.btn}
            onClick={() => history.push("/signup")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
