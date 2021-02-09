// This script runs on the "Forgot Password" page.

// Function to check whether the given string is an email address.

checkEmail = (text) => { 
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
}

// Initializing message and error message, and grabbing each of their <p> tags, respectively.

let message = '';
let errorMessage = ''
let messageP = document.querySelector('#p-forgot-password-message');
let errorP = document.querySelector('#p-forgot-password-error');

function submit(){

    /* This function runs when the user submits the "forgot password" form. It grabs the username and email address,
     then checks to see if they are valid (though not necessarily a match in the system yet). */

    let username = document.querySelector('#input-forgot-password-username').value;
    let email = document.querySelector('#input-forgot-password-email').value;
    if (checkEmail(email) === false){
        errorP.textContent = "Please enter a valid email";
        if (errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
    } else if (username === '' || username.length > 30){
        errorP.textContent = "Please enter a valid username";
        if (errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
    } else {

        /* Form is submitted to the server. If everything is good server-side, the user is redirected to another page 
        giving them instructions on how to reset their password. If unsuccessful, an error is displayed, either the one 
        sent from the server or a generic "an error occurred" if none can be found. */
        let fd = {
            username: username,
            email: email
        }
        if (!errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
        if (messageP.classList.contains('hide')){
            messageP.classList.toggle('hide');
        }
        messageP.textContent = "Submitting..."
        axios.post('https://nanaimg.net/forgotPassword', fd)
            .then(res => {
                let data = res.data;
                if(data.error){
                    messageP.classList.toggle('hide');
                    errorP.textContent = data.error;
                    if (errorP.classList.contains('hide')){
                        errorP.classList.toggle('hide');
                    }
                    
                } else if(data.success){
                    window.location.href = "https://nanaimg.net/passwordReset";
                }
            })
            .catch(err => {
                messageP.classList.toggle('hide');
                errorP.textContent = "An error occurred. Please try again.";
                if (errorP.classList.contains('hide')){
                    errorP.classList.toggle('hide');
                }
            })
    }
}

function cancel(){
    window.location.href = "https://nanaimg.net/login";
}