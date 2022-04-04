import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import pageNotFound from "../verifyEmail/page_not_found.svg";
import { useHistory } from "react-router-dom";
function EmailVerify() {
  const [validUrl, setValidUrl] = useState(false);
  const[loading, setLoading] = useState(false);
  const param = useParams();
  let history = useHistory();
  //http://localhost:3001/api/users/${param.id}/verify/${param.token}
  useEffect(() => {
    const verifyEmailUrl = async () => {
      setLoading(true);
      try {
        await axios
          .get(
            `https://veri-project-heroku.herokuapp.com/api/users/${param.id}/verify/${param.token}`
          )
          .then((response) => {
          
            setLoading(false);
            setValidUrl(true);
          });
      } catch (error) {
    
        setLoading(false);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);
  return (
    <div className={styles.page_con}>
      {loading? <p className={styles.load}>Loading...</p>: 
        validUrl ? (<div className={styles.page_con}>
          <h1>Email verified successfully</h1>

          <button className={styles.btn} onClick={() => history.push("/login")}>
            Login
          </button>
        </div>):(<>
          <img src={pageNotFound} className={styles.not_found_svg} />
          <h1>
            <span>404</span> Not Found
          </h1>
        </>)
        
      }
      
    </div>
  );
}

export default EmailVerify;
