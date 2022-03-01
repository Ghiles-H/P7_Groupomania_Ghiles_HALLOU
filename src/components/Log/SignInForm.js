import React, { useState } from "react";
import axios from "axios";
const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const urlApi = "http://localhost:8080/api/users/login";
  const handelLogin = (e) => {
    e.preventDefault();
    const passwordError = document.querySelector(".password.error");
    axios({
      method: "post",
      url: urlApi,
      withCredentials: true,
      data: {
        email: email,
        password: password,
      },
    })
      .then((res) => {
        passwordError.innerHTML = "";
        window.location = "/";
      })
      .catch((err) => {
        console.log("Il y a cette erreur =>", err);
        passwordError.innerHTML = "Email et/ou Password invalide";
      });
  };

  return (
    <form action="" onSubmit={handelLogin} id="sign-in-form">
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <br />
      <br />
      <label htmlFor="password">Password</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <br />
      <div className="password error"></div>
      <br />
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SignInForm;
