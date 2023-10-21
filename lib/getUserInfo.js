function getUserInfo(user) {
  return {
    username: user.username,
    name: user.name,
    email: user.email,
    id: user.id || user._id,
  };
}

module.exports = getUserInfo;
