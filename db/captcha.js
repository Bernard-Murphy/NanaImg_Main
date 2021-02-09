const request = require('request');

// Returns a Captcha object with currently only one method, which is used to verify Google reCaptcha challenges that people complete when they want to post a comment or an image. The verify method accepts an address, which is a call to Google's reCaptcha servers that contain my site's Captcha key along with the user's individual Captcha challenge key. If the set of key's are valid, Google will send me a response telling the server that it was a success, and the user may proceed. If not, it will return a failure.

let captcha = {};

captcha.verify = (address) => {
    return new Promise((resolve, reject) => {
        request(address, async (err, res, body) => {
            if (err){
                return reject("failure")
            }
            body = await JSON.parse(body);
            if (body.success === true){
                return resolve("success")
            } else {
                return reject("Captcha failed. Please try again.")
            }
        })
    })
}

module.exports = captcha;