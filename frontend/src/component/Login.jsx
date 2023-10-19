import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { loginActions, loginThunk } from "../slice/userSlice";

export default function Login() {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const [visible, setVisible] = useState(false);
  const [inputError, setInputError] = useState({
    emailid: "",
    pwd: "",
  });
  const handleClickShowPassword = () => {
    setVisible(!visible);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let { user, error, token } = useSelector((state) => ({
    ...state.loginStore,
  }));
  useEffect(() => {
    if (error?.length !== 0) {
      dispatch(loginActions.errorReducer());
    }

    if (user.length !== 0) {
      user.isAdmin || localStorage.getItem("isAdmin") == "true"
        ? navigate("/adminDashboard")
        : navigate("/explore");
    }
  }, [user, token, dispatch, navigate, error]);

  const isValid = () => {
    let pwd = inputData.password === "" ? "please enter Password" : "";
    let emailid = inputData.email === "" ? "please enter Email address" : "";

    if (pwd || emailid) {
      setInputError({ pwd, emailid });
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    event.preventDefault();
    let error = "";

    const { name, value } = event.target;

    switch (name) {
      case "password":
        setInputData({ ...inputData, password: value });
        error =
          value === ""
            ? "please enter password"
            : value.length < 8
            ? "Password length is greater than or equal to 8 characters "
            : value.toLowerCase().includes("password")
            ? "password cannot contains string('password')"
            : "";
        setInputError({ ...inputError, pwd: error });
        break;
      case "email":
        setInputData({ ...inputData, email: value });
        error =
          value === ""
            ? "Please Enter Email Address"
            : !value
                .toLowerCase()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ? "please Enter Valid Email Address.must include @ and ."
            : "";

        setInputError({ ...inputError, emailid: error });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    const valid = isValid();

    if (valid) {
      event.preventDefault();

      if (!inputError.emailid && !inputError.pwd) {
        dispatch(loginThunk(inputData));
      } else {
        toast.error("You cannot login .please enter proper data ");
      }
    } else {
      toast.error("You cannot login .please enter proper data ");
    }
  };

  return (
    <>
      <div className="centered-form">
        <div className="centered-form__box">
          {error && <div className="error">{error}</div>}
          <div className="">
            <div>Email Address</div>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={inputData.email}
              onChange={handleChange}
            />
            {inputError.emailid && <div className="error">{inputError.emailid}</div>}
          </div>
          <div>
            <div>Password</div>
            <input
              type={visible ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={inputData.password}
              onChange={handleChange}
            />
            <div onClick={handleClickShowPassword}>
              {visible ? "Hide" : "Show"}
            </div>
            {inputError.pwd && <div className="error">{inputError.pwd}</div>}
          </div>
          <div className="flex">
            <input
              type="checkbox"
              onChange={(e) => {
                setInputData({ ...inputData, isAdmin: e.target.checked });
              }}
              style={{
                width: "50px",
              }}
            />
            Login as admin
          </div>
          <button type="submit" onClick={handleSubmit}>
            Sign In
          </button>
        </div>
      </div>
    </>
  );
}
