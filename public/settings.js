/* This script runs on the "User Settings" page in the user dashboard. It allows users to select which badge they want 
appearing next to their name when they post images or comments. */


// Grabs all of the checkboxes and labels
let checkboxes = document.getElementsByClassName('us-inputs');
let labels = document.getElementsByClassName('us-labels');


/* Adds event listeners to each of the checkboxes and labels which will uncheck all other boxes when a box is checked, 
and which will check the corresponding box when a label is clicked. */
for (let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click', () => {
        let id = checkboxes[i].id.split('-')[2];
        for (let j = 0; j < checkboxes.length; j++){
            if (checkboxes[j].id.split('-')[2] === id){
                checkboxes[j].checked = true;
            } else {
                checkboxes[j].checked = false;
            }
        }
    });

    labels[i].addEventListener('click', () => {
        let id = labels[i].id.split('-')[2];
        for (let j = 0; j < checkboxes.length; j++){
            if (checkboxes[j].id.split('-')[2] === id){
                checkboxes[j].checked = true;
            } else {
                checkboxes[j].checked = false;
            }
        }
    });
}


/* When a user clicks submit, a variable pick is initialized to 3. This corresponds to the "Verified" badge. The 
functon then loops through the checkboxes, and changes pick to the one corresponding to the checked box. A post request 
is then made to the server, which changes the user's badge. The user is then redirected to their dashboard. */
let submit = document.querySelector('#us-submit-button');
submit.addEventListener('click', () => {
    let pick = 3;
    for (let i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked === true){
            pick = checkboxes[i].id.split('-')[2];
            let fd = new FormData();
            fd.append('pick', pick);
            axios.post('https://nanaimg.net/dashboard/settings/pick', fd)
                .then(res => {
                    window.location.href = "https://nanaimg.net/dashboard";
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    
    window.location.href="https://nanaimg.net/dashboard";
})