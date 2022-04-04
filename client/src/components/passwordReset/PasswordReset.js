import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

function PasswordReset() {
  const param = useParams();
  let history = useHistory();

  const [loginShow, setLoginShow] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const initialdata = {
    password: "",
  };
  //http://localhost:3001/api/password-reset/${param.id}/${param.token}
  const showToggle = () => setShow((prev) => !prev);
  const onSubmitForm = async (data) => {
    setLoading(true);

    try {
      await axios
        .post(
          `https://veri-project-heroku.herokuapp.com/api/password-reset/${param.id}/${param.token}`,
          data
        )
        .then((res) => {
          setLoading(false);
          setMessage(res.data.message);
          setLoginShow(true);
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
    password: Yup.string()
      .min(8)
      .required("password required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "weak password!! needs at least one: small letter, capital letter, number and special character."
      ),
  });

  return (
    <div className={styles.page_con}>
      <div className={styles.email_con}>
        <div className={styles.top_con}>
          <h1>Reset password</h1>
          <p>Please enter a new passoword</p>
        </div>
        <div className={styles.bottom_con}>
          <Formik
            initialValues={initialdata}
            onSubmit={onSubmitForm}
            validationSchema={validateScheme}
          >
            <Form className={styles.form_container}>
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
              {loginShow ? (
                <button
                  className={styles.btn_login}
                  onClick={() => history.push("/login")}
                >
                  login
                </button>
              ) : (
                <button className={styles.btn} type='submit'>
                  reset
                </button>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
