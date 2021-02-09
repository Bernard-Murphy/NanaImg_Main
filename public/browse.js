/* These are three annoying scripts that I had to write to stop mobile users' keyboards from popping up when
 clicking certain dropdown menus. Because React Select apparently uses input fields for some of its dropdown menus, 
 I had to treat it like a text input and make it readonly. In the future when I update the website I will get rid of 
 all React Select instances. */

const html = document.querySelector('html');
html.addEventListener('click', () => {
    let inputCheck = document.querySelectorAll('input');
    if (inputCheck.length){
        for (let i = 2; i < inputCheck.length + 3; i++){
            let input = document.querySelector(`#react-select-${i}-input`);
            if (input !== null){
                input.readOnly = true;
            }
        }
    }
})

html.addEventListener('load', () => {
    let inputCheck = document.querySelectorAll('input');
    if (inputCheck.length){
        for (let i = 2; i < inputCheck.length + 3; i++){
            let input = document.querySelector(`#react-select-${i}-input`);
            if (input !== null){
                input.readOnly = true;
            }
        }
    }
})

html.addEventListener('change', () => {
    let inputCheck = document.querySelectorAll('input');
    if (inputCheck.length){
        for (let i = 2; i < inputCheck.length + 3; i++){
            let input = document.querySelector(`#react-select-${i}-input`);
            if (input !== null){
                input.readOnly = true;
            }
        }
    }
})
