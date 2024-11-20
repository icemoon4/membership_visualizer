import stylesLogin from "./Login.module.css";
import styles from "../App.module.css";
import LogoHeader from "./LogoHeader";

export default function Login() {
  //in the future: this url here: https://medium.com/@preciousimoniakemu/create-a-react-login-page-that-authenticates-with-django-auth-token-8de489d2f751
  //I think this should take the branch name as a parameter a put it in the header
  function sendQuery(e) {
    return "lol";
  }
  return (
    <main className={stylesLogin.loginPage}>
      <div className={stylesLogin.loginContainer}>
        <LogoHeader />
        <label for="username">Username: </label>
        <input
          //value={queryParameters.current.get({ name }) || ""}
          type="text"
          onChange={(e) => sendQuery(e.target.value)}
        />
        <label for="password">Password: </label>
        <input
          //value={queryParameters.current.get({ name }) || ""}
          type="text"
          onChange={(e) => sendQuery(e.target.value)}
        />
        <button className={styles.redButton}>Log in</button>
      </div>
    </main>
  );
}
