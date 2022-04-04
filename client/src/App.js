import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EmailVerify from "./components/verifyEmail/EmailVerify";
import PasswordReset from "./components/passwordReset/PasswordReset";
import Login from "./components/signIn/Login";
import Register from "./components/signUp/Register";
import HomePage from "./components/homePage/HomePage";
import RequestPassReset from "./components/requestPassReset/RequestPassReset";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Router>
      <Switch>
        {user ? (
          <Route path='/' exact component={HomePage} />
        ) : (
          <Route path='/' exact component={Login} />
        )}

        <Route path='/login' exact component={Login} />
        <Route path='/signup' exact component={Register} />
        <Route path='/users/:id/verify/:token' component={EmailVerify} />
        <Route path='/req-password-reset/' component={RequestPassReset} />
        <Route path='/password-reset/:id/:token' component={PasswordReset} />
      </Switch>
    </Router>
  );
}

export default App;
