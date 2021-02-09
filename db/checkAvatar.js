// Used when posting a comment to determine whether the user's avatar is valid. Will pretty much always return true unless a malicious user is trying to attack the site using Postman or something.

function checkAvatar(avatar) {
    if (typeof avatar != "string") return false 
    return !isNaN(avatar) && !isNaN(parseFloat(avatar))
  }

  module.exports = checkAvatar;