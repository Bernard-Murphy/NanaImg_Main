// This script runs on the password reset page


/* Initializes the message and the error messages that the user can see when trying to reset his or her password, and 
grabs the DOM elements, messageP and errorP, which will contain these messages. It also grabs the uuid that was 
contained in the url that was emailed to the person trying to reset their password. */
let message = '';
let errorMessage = ''
let messageP = document.querySelector('#p-forgot-password-message');
let errorP = document.querySelector('#p-forgot-password-error');
let uuid = window.location.href.split('/')[4];

/* This function runs when the user submits the password reset form. It performs a series of tests to make sure that 
the passwords match and are within the right parameters, then makes a POST request to the server to reset the user's 
password. If everything goes through, the user is redirected to their dashboard. If not, the appropriate error message 
is shown. */

function submit(){
    let pass1 = document.querySelector('#input-new-password-1').value;
    let pass2 = document.querySelector('#input-new-password-2').value;
    if (pass1 !== pass2){
        errorP.textContent = 'Passwords must match';
        if (errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
    } else if (pass1.length === 0){
        errorP.textContent = 'Your password is too short';
        if (errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
    } else if (pass1.length > 256){
        errorP.textContent = 'Your password is too long (256 char max)';
        if (errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
    } else if (pass1.split('\\').length > 1){
        errorP.textContent = 'Your password contains invalid character "\\"';
        if (errorP.classList.contains('hide')){
            errorP.classList.toggle('hide');
        }
    } else {
        let fd = {
            newPass: pass1
        }
        axios.post(`https://nanaimg.net/reset/${uuid}`, fd)
            .then(res => {
                if (res.data.success){
                    window.location.href = 'https://nanaimg.net/dashboard';
                } else if (res.data.error){
                    errorP.textContent = res.error;
                    if (errorP.classList.contains('hide')){
                        errorP.classList.toggle('hide');
                    }
                } else {
                    errorP.textContent = 'An error occurred. Please try again.';
                    if (errorP.classList.contains('hide')){
                        errorP.classList.toggle('hide');
                    }
                }
            })
            .catch(err => {
                errorP.textContent = 'An error occurred. Please try again.';
                if (errorP.classList.contains('hide')){
                    errorP.classList.toggle('hide');
                }
            })

    }
}

// If the user clicks "Cancel, they are taken to the home page."
function cancel(){
    window.location.href = 'https://nanaimg.net'
}