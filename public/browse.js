// This script runs on NanaImg.net/browse

//const html = document.querySelector("html");
// let time = 0;
// html.addEventListener("click", () => {
//     unSort();
// })

// function sort(){
//     const button = document.querySelector("#button-sort-by");
//     const aRecent = document.querySelector("#a-sort-recent");
//     const aPopular = document.querySelector("#a-sort-popular")
//     button.style.display = "none";
//     aRecent.style.display = "block";
//     aPopular.style.display = "block";
// }

// function unSort(){
//     console.log(time);
//     const button = document.querySelector("#button-sort-by");
//     const aRecent = document.querySelector("#a-sort-recent");
//     const aPopular = document.querySelector("#a-sort-popular");
//     if (time === 1){
//         if (button.style.display === "none"){
//             button.style.display = "block";
//             aRecent.style.display = "none";
//             aPopular.style.display = "none";
//         }
//         time = 0;
//     } else {
//         if (button.style.display ==="none"){
//             time += 1;
//         }
//     }
// }

// console.log(window.location.href.split(':')[0]);


// These are three annoying scripts that I had to write to stop mobile users' keyboards from popping up when clicking certain dropdown menus. Because React Select apparently uses input fields for some of its dropdown menus, I had to treat it like a text input and make it readonly. In the future when I update the website I will get rid of all React Select instances.

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
