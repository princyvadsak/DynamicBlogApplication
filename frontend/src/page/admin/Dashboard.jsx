import React from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        {" "}
      
        <h1>Admin Dashboard</h1>
        <div>
          <button
            onClick={() => {
             navigate("/addPost");
            }}
          >
            Add Post
          </button>
        </div>
      </div>
    </>
  );
}
