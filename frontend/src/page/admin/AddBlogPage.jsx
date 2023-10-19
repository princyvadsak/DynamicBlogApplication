import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { postActions, postThunk } from "../../slice/postSlice";

export default function AddBlogPage() {
  const [inputData, setInputData] = useState({
    title: "",
    topic: "",
    description: "",
  });

  const [inputError, setInputError] = useState({
    title: "",
    topic: "",
    description: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let { post, error, token } = useSelector((state) => ({
    ...state.postStore,
  }));

  useEffect(() => {
    if (error?.length !== 0) {
      dispatch(postActions.errorReducer());
    }

    if (post.length !== 0) {
      navigate("/adminDashboard");
    }
  }, [post, token, dispatch, navigate, error]);

  const isValid = () => {
    let title = inputData.title === "" ? "please enter blog title" : "";
    let topic = inputData.topic === "" ? "please enter blog topic" : "";
    let description =
      inputData.description === "" ? "please enter description" : "";
    if (title || topic || description) {
      setInputError({ title, topic, description });
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = (event) => {
    const valid = isValid();

    if (valid) {
      event.preventDefault();

      if (!inputError.title && !inputError.description) {
        dispatch(postThunk(inputData));
      } else {
        toast.error("please enter proper data for blog post");
      }
    } else {
      toast.error("You cannot login .please enter proper data ");
    }
  };

  return (
    <>
      <div>
        <h1> Add Blog Post</h1>
      </div>
      <div>
        {error && <div className="error">{error}</div>}
        <div className="">
          <div>Blog Title:</div>
          <input
            type="text"
            name="title"
            placeholder="Enter Blog Title"
            value={inputData.title}
            onChange={handleChange}
          />
          {inputError.title && <div className="error">{inputError.title}</div>}
        </div>
        <div className="">
          <div>Blog Topic:</div>
          <input
            type="text"
            name="topic"
            placeholder="Enter Blog Topic"
            value={inputData.topic}
            onChange={handleChange}
          />
          {inputError.topic && <div className="error">{inputError.topic}</div>}
        </div>
        <div className="">
          <div>Blog description:</div>
          <textarea
            name="description"
            placeholder="Enter Blog Description"
            value={inputData.description}
            onChange={handleChange}
          />
          {inputError.title && <div className="error">{inputError.description}</div>}
        </div>

        <button type="submit" onClick={handleSubmit}>
          Save Blog
        </button>
      </div>
    </>
  );
}
