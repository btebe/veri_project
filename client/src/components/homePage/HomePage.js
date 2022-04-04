import React from "react";
import styles from "./styles.module.css";
import welcomeSvg from "../homePage/welcome.svg";
function HomePage() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };
  const user = localStorage.getItem("username");

  return (
    <div className={styles.home}>
      <img src={welcomeSvg} className={styles.welcome_svg} />
      <h1>{user} !</h1>

      <button className={styles.btn} onClick={logout}>
        logout
      </button>
    </div>
  );
}

export default HomePage;
