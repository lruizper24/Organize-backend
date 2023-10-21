const Mongoose = require("mongoose");
const { generateAccessToken,generateRefreshToken } = require("../auth/generateTokens");
const bcrypt = required('bcrypt');
const getUserInfo = require("../lib/getUserInfo");
const Token = require("../schema/token");


const UserSchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        const document = this;

        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) {
                next(err);
            } else {
                document.password = hash;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.methods.usernameExist = async function (username) {
    const result = await Mongoose.model('User').findOne({ username });
    return !! result;
};

UserSchema.methods.comparePassword = async function (password, hash) {
    const same = await bcrypt.compare(password, hash);    
}

UserSchema.methods.createAccessToken = function () { 
    return generateAccessToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function (next) {
  const refreshToken = generateRefreshToken(getUserInfo(this));

  console.error("refreshToken", refreshToken);

  try {
    await new Token({ token: refreshToken }).save();
    console.log("Token saved", refreshToken);
    return refreshToken;
  } catch (error) {
    console.error(error);
    //next(new Error("Error creating token"));
  }
};

module.exports = Mongoose.model("User", UserSchema);
