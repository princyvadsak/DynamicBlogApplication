const express = require("express");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");

const cors = require("cors");

require("./db/mongoose");
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(postRouter);

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
