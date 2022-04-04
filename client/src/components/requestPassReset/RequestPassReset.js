import { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
function RequestPassReset() {
  let history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const initialdata = {
    email: "",
  };
  //http://localhost:3001/api/password-reset/
  const onSubmitForm = async (data) => {
    setLoading(true);
    try {
      await axios
        .post("https://veri-project-heroku.herokuapp.com/api/password-reset/", data)
        .then((res) => {
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
    email: Yup.string()
      .email("invalid email format")
      .required("email required"),
  });
  return (
    <div className={styles.page_con}>
      <div className={styles.email_con}>
        <div className={styles.top_con}>
          <h1>Forgot password?</h1>
          <p>Enter your email and we'll reset it for you</p>
        </div>
        <div className={styles.bottom_con}>
          <Formik
            initialValues={initialdata}
            onSubmit={onSubmitForm}
            validationSchema={validateScheme}
          >
            <Form className={styles.form_container}>
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

              {loading && <p className={styles.load}>Loading...</p>}
              {error && <p className={styles.errorMsg}>{error}</p>}
              {message && <p className={styles.message}>{message}</p>}

              <button className={styles.btn} type='submit'>
                submit
              </button>
              <p className={styles.login}>
                or
                <span onClick={() => history.push("/login")}>login</span>
              </p>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default RequestPassReset;
