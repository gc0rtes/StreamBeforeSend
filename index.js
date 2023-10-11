const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware CORS
app.use(cors());

// Webhook handler
app.post("/", (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    let parsedBody = JSON.parse(body);

    /*
      If you decide to reject the message, the endpoint must return the same message structure but with the message type set to error (the HTTP response code should still be 200).    
      If the message type is set to error, it won’t be returned to clients but will still be saved into the Stream's database.
     */
    if (parsedBody.message.text.trim() === "foobar") {
      parsedBody.message.text = "your message has been moderated";
      parsedBody.message.type = "error";
      parsedBody.message.my_custom_field = true;
    }
    //You must return the whole body
    res.status(200).send(parsedBody);
  });
});

//test
app.get("/test", (req, res) => {
  res.send(`server up and running on port ${port}`);
});

app.listen(port, () => {
  console.log(`server up and running on port ${port}`);
});
