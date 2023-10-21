const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema");

router.post("/", async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!!!name || !!!email || !!!username || !!!password) {
      return res.status(400).json(
        jsonResponse(400, {
          error: "Diligencie los campos",
        })
      );
    }

  //crear usuario
  //const user = new User

  

try {
    const user = new User();
    const exists = await user.usernameExist(username);

    if (exists) {
      return res.status(400).json(
        jsonResponse(400, {
          error: "Este usuario ya existe",
        })
      );
    }

    const newUser = new User({ name, email, username, password });

    newUser.save();
    res
      .status(200)
      .json(jsonResponse(200, { message: "Usuaro creado exitosamente" }));
    res.send("signout");
} catch (error) {
  res.status(500).json(
    jsonResponse(500, {
      error: "Error en la creación del usuario",
    })
  );
  }
});

module.exports = router;
