import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import AddBlogPage from "./page/admin/AddBlogPage";
import { loginActions } from "./slice/userSlice";
import Dashboard from "./page/admin/Dashboard";
import "./index.css"

function App() {
  let { token, user } = useSelector((state) => ({
    ...state.loginStore,
  }));

  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear()
    dispatch(loginActions.logoutReducer());
    window.location.replace("/")
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        {token || localStorage.getItem("logToken") ? (
          <>

            {user.isAdmin || localStorage.getItem("isAdmin") == "true" ? (<>
              <Route exact path="/adminDashboard" element={<>  <button onClick={handleLogout}>Logout</button><Dashboard /></>} />
              <Route exact path="/addPost" element={<> <button onClick={handleLogout}>Logout</button><AddBlogPage /></>} />
            </>) :
              (<>
                <Route exact path="/explore" element={<> <button onClick={handleLogout}>Logout</button>< div>
                  Welcome To unique and beautiful blog </div></>} />
              </>)}
            <Route exact path="*" element={<div>page not found</div>} />
          </>
        ) : (
          <Route exact path="*" element={<div>please do login first</div>} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
