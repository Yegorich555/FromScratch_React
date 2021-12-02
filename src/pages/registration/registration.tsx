import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Modal from "@/components/modal/modal";
import signin from "@/pages/signin/signin.module.scss";
import { Registration } from "../../types/types";

const Registration: React.FunctionComponent<Registration> = function ({
  active,
  userLoggedIn,
  setRegistrationModal,
  setUserName,
}) {
  const [nameDirty, setNameDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [nameError, setNameError] = useState("Field is empty!");
  const [passwordError, setPasswordError] = useState("Field is empty!");
  const history = useHistory();
  const blurHandler = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    switch (e.target.name) {
      case "name":
        setNameDirty(true);
        break;
      case "password":
        setPasswordDirty(true);
        break;
      default:
        console.log("check");
    }
  };

  const [input, setInput] = useState({
    name: "",
    password: "",
  });

  const nameCheck = /^(\S+)[,\s]*$/;
  const passwordCheck = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "password") {
      !passwordCheck.test(String(e.target.value).toLowerCase())
        ? setPasswordError(
            "Password should include at least 1 number [0-9], at least one letter in lower and one in upper case and at least one symbol "
          )
        : setPasswordError("");
    }
    if (e.target.name === "name") {
      !nameCheck.test(String(e.target.value).toLowerCase())
        ? setNameError("Login should start with letter in uppercase and then letters lower case")
        : setNameError("");
    }

    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  }
  const redirect = () => {
    history.push("/profile");
  };

  const compare = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== input.password) {
      setPasswordError("passwords don't match");
    } else {
      setPasswordError("Good");
    }
  };
  function handleClick(e: { preventDefault: () => void }) {
    e.preventDefault();
    const formData = {
      name: input.name,
      password: input.password,
    };
    axios
      .put("/api/auth/signUp", formData)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          localStorage.setItem("token", JSON.stringify(res.data));
          const info: object = JSON.parse(localStorage.getItem("token") as string);
          // @ts-ignore
          setUserName(info.name);
          redirect();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setRegistrationModal(false);
    userLoggedIn();
  }
  const enabled = input.name.length > 0 && input.password.length > 0;
  return (
    <Modal isActive={active}>
      <form className={signin.formData}>
        <div className={signin.wrapper}>
          <span className={signin.title}>Login</span>
          {nameDirty && nameError && <div style={{ color: "red" }}>{nameError}</div>}
          <input
            type="text"
            name="name"
            value={input.name}
            data-rule="text"
            required
            onChange={(e) => handleChange(e)}
            onBlur={(e) => blurHandler(e)}
          />
        </div>
        <br />
        <div className={signin.wrapper}>
          <span className={signin.title}>Password</span>
          {passwordDirty && passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
          <input
            type="password"
            name="password"
            value={input.password}
            data-rule="password"
            required
            onChange={(e) => handleChange(e)}
            onBlur={(e) => blurHandler(e)}
          />
        </div>
        <br />
        <div className={signin.wrapper}>
          <span className={signin.title}>Second Password</span>
          {passwordDirty && passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
          <input type="password" name="password1" data-rule="password" required onChange={(e) => compare(e)} />
        </div>
        <br />
        <button type="button" className={signin.but} onClick={handleClick} disabled={!enabled}>
          Отправить
        </button>
      </form>
    </Modal>
  );
};
export default Registration;