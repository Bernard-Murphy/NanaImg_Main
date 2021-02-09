// This script runs on all of the image pages.

// Initializing an empty posts array.
let posts = [];

// Function used to determine if a string is a number.
function isANumber(str) {
    return !isNaN(str) &&
           !isNaN(parseFloat(str)) 
  }


// onaCopy and regCopy are used to copy embed links and direct links to users' clipboards, respectively. The way it works is there are hidden input fields on the page that contain these links. When the user clicks one of these "copy link" buttons, the dom will quickly unhide these inputs, then select and copy these links from the inputs, then hide the inputs again. The user is not able to see these inputs, but they will be copied to his or her clipboard.

function onaCopy(){
    const code = document.getElementById('input-ona-embed');
    code.classList.remove('hide');
    code.select();
    code.setSelectionRange(0, 9999);
    document.execCommand('copy');
    code.classList.add('hide');
    const tooltip = document.querySelector('#span-onatool');
    tooltip.setAttribute('data-tooltip', 'Embed link copied')
}

function regCopy(){
    const code = document.getElementById('input-reg-embed');
    code.classList.remove('hide');
    code.select();
    code.setSelectionRange(0, 9999);
    document.execCommand('copy');
    code.classList.add('hide');
    const tooltip = document.querySelector('#span-regtool');
    tooltip.setAttribute('data-tooltip', 'direct link copied')
}

// getPosts grabs all of the elements with the class .comment-numbers, which are the ids on each of the comments. It then adds each of these elements to the previously initialized "posts" array from line 4. It then adds an event listener for each of these id elements when clicked: 

// First, it checks to see if the comment form is expanded. If it is, it does nothing because the comment form (located in another file) already knows how to handle the user clicking the ids. If the comment form is not expanded, it opens the comment form by simulating a click on the "add a comment" button. It then adds the ID to the hidden paragraph with the id #read-p, which the form knows to read when it opens up and add to the textbox.

function getPosts(){
    let postNums = document.getElementsByClassName('comment-numbers');
    for (let i = 0; i < postNums.length; i++){
        posts.push(postNums[i]);
    }
    posts.forEach((post) => {
        post.addEventListener('click', () => {
            let textArea = document.querySelector('#comment-textarea');
            if (textArea === null){
                let readP = document.querySelector('#read-p');
                readP.textContent = post.textContent
                document.querySelector('#add-a-comment').click();
                textArea = document.querySelector('#comment-textarea');
            }
        })
    })
}

getPosts();

// parsePosts parses through all of the comments on an image, bolds and changes the color of quoted comments, adds anchor tags for users to navigate to quoted comments, adds mouse hover event listeners to show previews of quoted comments, and adds a "replies" section to any comments that have replies.

function parsePosts(){

    // Grabs all of the comment text from each of the comments, grabs all of the comment numbers, and initializes empty arrays for comment text, comment numbers, comments, and comments with quotes (replies)

    let comments = document.getElementsByClassName("comment-text");
    let commentText = [];
    let allNums = [];
    let allComments = document.getElementsByClassName('comment-numbers');
    let allComs = [];
    let comsWithQuotes = [];

    // Grabs all of the comments from allComments, removes their number signs, then pushes them into allComs. Also pushes the comment text from comments into the array commentText.

    for (let p = 0; p < allComments.length; p++){
        allComs.push(allComments[p].textContent.split('#')[1]);
    }
    for (let i = 0; i < comments.length; i++){
        commentText.push(comments[i]);
    }

    // Goes through each comment and checks to see if there are any comments being quoted by checking the length of each comment when it is split by the double numbers sign (##). If it is greater than one, it creates an array with all the sections of the comment without the double numbers signs, and initializes three empty arrays: quoteNums, hrefs, and justNums. 

    for (let i = 0; i < commentText.length; i++){
        if (commentText[i].textContent.split('##').length > 1){
            let splitPost = commentText[i].textContent.split('##');
            let quoteNums = [];
            let hrefs = [];
            let justNums = [];

            // Starting with index 1 (because the first will always be either an empty string or text before the first double numbers sign), each section of the splitPost array is evaluated. Arrays newJust, newHref, and newNum are initialized Eventually we want a number, a number preceeded by #c, and a number preceeded by ## - for use later. potNum splits the evaluated section into individual letters. still is set to true, and index set to 0 in order to be used to terminate the while loop later. 

            for (j = 1; j < splitPost.length; j++){
                let newJust = [];
                let newHref = ['#c']
                let newNum = ['#', '#'];
                let potNum = splitPost[j].split('');
                let still = true;
                let index = 0

                // Goes through each individual value in the potNum array. If the value is a number, it gets pushed to each of the arrays (newJust, newHref, newNum), then increments the index of potNum to be evaluated. Once it hits a value that is not a number, the loop terminates. Once the loop is finished, newNum, newHref, and newJust are joined and pushed to quoteNums, hrefs, and justNums, respectively.

                while (still === true){
                    if (index > potNum.length - 1){
                        still = false
                    } else if (isANumber(potNum[index])) {
                        newNum.push(potNum[index]);
                        newHref.push(potNum[index]);
                        newJust.push(potNum[index]);
                        index += 1;
                    } else {
                        still = false
                    }
                }
                justNums.push(newJust.join(''));
                quoteNums.push(newNum.join(''));
                hrefs.push(newHref.join(''));
            }

            // After each section of the comment is evaluated, duplicates are removed and the contents of justNums is pushed to allNums and comsWithQuotes - in order to add replies section to those comments later. 

            quoteNums = [...new Set(quoteNums)];
            hrefs = [...new Set(hrefs)];
            justNums = [...new Set(justNums)];
            justNums.forEach((num) => {
                allNums.push(num);
                comsWithQuotes.push([allComs[i], num]);
            })

            // In this next step we go through each comment and add the bold red font to all of the quotes, along with a tags that redirect the user to the comments that are being quoted, and add classnames to be used later when we add event listeners to each of them.

            // First initialize newPost, which is just the text of the comment. Then, go through the quoteNums array. As a reminder, each element in the quoteNums array is two number signs followed by a number, the format that users use to quote each other. For each element, newPost is split by that string. If it has a length greater than one, it means that quote is contained in the comment and will be processed. 

            let newPost = commentText[i].textContent;
            for (let k = 0; k < quoteNums.length; k++){
                let appendedPost = newPost.split(quoteNums[k]);

                // Checks if the quoted comment is in the same comment section, otherwise it gets the class .another-thread

                if (allComs.indexOf(justNums[k]) !== -1){

                    // If the length is greater than two, it means that the same comment is being quoted more than once.

                    if (appendedPost.length > 2){
                        for (let l = 1; l < appendedPost.length; l++){

                            // This prevents the code from breaking when one number is a continuation of another number. For instance, someone may quote ##1, ##10, and ##100 and they will be treated differently.

                            if (isANumber(appendedPost[l].split('')[0]) === false){
                                appendedPost[l]= `<p class="post-quotes h${justNums[k]}"><a class="post-quotes" href='${hrefs[k]}'>##</a>${justNums[k]}</p> ${appendedPost[l]}`;
                            } else {
                                appendedPost[l] = `##${justNums[k]}${appendedPost[l]}`;
                            }
                        }
                        newPost = appendedPost.join('');
                    } else {
                        if (appendedPost[0] === ""){
                            if (isANumber(appendedPost[0].split('')[0]) === false){
                                appendedPost[0] = `<p class="post-quotes h${justNums[k]}"><a class="post-quotes" href='${hrefs[k]}'>##</a>${justNums[k]}</p>`;
                            } else {
                                appendedPost[l] = `##${justNums[k]}${appendedPost[0]}`;
                            }

                        // Ensures that text before the quotes is not erased.
                        } else {
                                appendedPost.splice(1, 0, `<p class="post-quotes h${justNums[k]}"><a class="post-quotes" href='${hrefs[k]}'>##</a>${justNums[k]}</p>`);
                        }
                        newPost = appendedPost.join('');
                    } 
                } else {
                    if (appendedPost.length > 2){
                        for (let l = 1; l < appendedPost.length; l++){
                            if (isANumber(appendedPost[l].split('')[0]) === false){
                                appendedPost[l]= `<p class="post-quotes another-thread"><a class="post-quotes another-thread" href='https://nanaimg.net/comments/${justNums[k]}'>##</a>${justNums[k]}</p> ${appendedPost[l]}`;
                            } else {
                                appendedPost[l] = `##${justNums[k]}${appendedPost[l]}`;
                            }
                        }
                        newPost = appendedPost.join('');
                    } else {
                        if (appendedPost[0] === ""){
                            if (isANumber(appendedPost[0].split('')[0]) === false){
                                appendedPost[0] = `<p class="post-quotes another-thread"><a class="post-quotes another-thread" href='https://nanaimg.net/comments/${justNums[k]}'>##</a>${justNums[k]}</p>`;
                            } else {
                                appendedPost[l] = `##${justNums[k]}${appendedPost[0]}`;
                            }
                        } else {
                                appendedPost.splice(1, 0, `<p class="post-quotes another-thread"><a class="post-quotes another-thread" href='https://nanaimg.net/comments/${justNums[k]}'>##</a>${justNums[k]}</p>`); 
                        }
                        newPost = appendedPost.join('');
                    }
                }
            }

            // Updates the innerHTML of the comment to reflect the new changes.
            commentText[i].innerHTML = `<p class="comment-text">${newPost}</p>`;
        }
    }

    // This next section adds event listeners to all of the comment quotes so that when you hover over them, they show a preview of the comments that they are quoting. 

    allNums = [...new Set(allNums)];
    for (let n = 0; n < allNums.length; n++){
        let allQuotes = document.getElementsByClassName(`h${allNums[n]}`);

        // For every quote element on a comment, when a user hovers over it, there will be a check to see if an element exists on the page with the class "pop-up". If not, it will create a new pop-up div using information that it draws from the comment that it is quoting. The location of the pop-up will depend upon where the user's cursor is located at the time of triggering the event. The pop-up's origin is in the top-left, and shows up slightly below and to the right of the mouse. If the mouse is too far to the right of the page that the pop up would shift off the screen, it is shifted to the left. If the mouse is too far towards the bottom of the page that it would go off the screen, it is shifted upwards.

        for (let o = 0; o < allQuotes.length; o++){
            allQuotes[o].addEventListener('mouseover', (e) => {
                let check = document.querySelector('.pop-up');
                if (check === null){
                    
                    // This if/else checks whether the quoted comment's author has a badge or an id. Otherwise the two blocks of code do pretty much the same thing. 

                    if (document.querySelector(`#id${allNums[n]}`) === null){
                        let commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment-divs');
                        commentDiv.classList.add('pop-up');
                        let infoDiv = document.createElement('div');
                        infoDiv.classList.add('comment-info-div');
                        let pName = document.createElement('p');
                        pName.classList.add('comment-name-badge');
                        pName.textContent = document.querySelector(`#n${allNums[n]}`).textContent;
                        pName.style.color = document.querySelector(`#n${allNums[n]}`).style.color;
                        let getBadge = document.querySelector(`#bad${allNums[n]}`);
                        let badge = document.createElement('img');
                        badge.classList.add('op-badges-mini');
                        badge.src = getBadge.src;
                        let pDate = document.createElement('p');
                        pDate.classList.add('comment-date-badge');
                        pDate.textContent = document.querySelector(`#d${allNums[n]}`).textContent;
                        let pId = document.createElement('p');
                        pId.classList.add('comment-id');
                        pId.classList.add('comment-numbers');
                        pId.textContent = document.querySelector(`#i${allNums[n]}`).textContent;
                        infoDiv.appendChild(pName);
                        infoDiv.appendChild(badge);
                        infoDiv.appendChild(pId);
                        commentDiv.appendChild(infoDiv);
                        let img = document.querySelector(`#img${allNums[n]}`);
                        if (img !== null){
                            let cImg = document.createElement('img');
                            cImg.src = img.src
                            cImg.classList.add('quote-avatar-images');
                            commentDiv.appendChild(cImg);
                        }
                        let pComment = document.createElement('p');
                        pComment.classList.add('comment-text');
                        pComment.textContent = document.querySelector(`#p${allNums[n]}`).textContent;
                        commentDiv.appendChild(pComment);
                        commentDiv.addEventListener('mouseleave', () => {
                            let popUp = document.querySelector('.pop-up');
                            popUp.remove();
                        });
                        commentDiv.style.top = `${e.pageY}px`;
                        let parent = document.getElementsByClassName('comment-text')[0];
                        parent.prepend(commentDiv);
                        let genDiv = document.querySelector(`.pop-up`);
                        genDiv.style.top = ((document.body.scrollHeight - e.pageY) < genDiv.clientHeight) ? `${e.pageY - genDiv.clientHeight}px` : `${e.pageY}px`;
                        genDiv.style.left = ((e.pageX/window.innerWidth) > 0.5) ? `${e.pageX - genDiv.clientWidth}px`: `${e.pageX}px`;
                    } else {
                        let commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment-divs');
                        commentDiv.classList.add('pop-up');
                        let infoDiv = document.createElement('div');
                        infoDiv.classList.add('comment-info-div');
                        let pName = document.createElement('p');
                        pName.classList.add('comment-name');
                        pName.textContent = document.querySelector(`#n${allNums[n]}`).textContent;
                        let getId = document.querySelector(`#idc${allNums[n]}`);
                        let pCId = document.createElement('p');
                        pCId.classList.add('comment-author-id');
                        pCId.innerHTML = `(ID: <span style="font-weight: bold; background: ${getId.style.background}; color: black;">${getId.textContent}</span>)`;
                        let pDate = document.createElement('p');
                        pDate.classList.add('comment-date');
                        pDate.textContent = document.querySelector(`#d${allNums[n]}`).textContent;
                        let pId = document.createElement('p');
                        pId.classList.add('comment-id');
                        pId.classList.add('comment-numbers');
                        pId.textContent = document.querySelector(`#i${allNums[n]}`).textContent;
                        infoDiv.appendChild(pName);
                        infoDiv.appendChild(pCId);
                        infoDiv.appendChild(pId);
                        commentDiv.appendChild(infoDiv);
                        let img = document.querySelector(`#img${allNums[n]}`);
                        if (img !== null){
                            let cImg = document.createElement('img');
                            cImg.src = img.src
                            cImg.classList.add('quote-avatar-images');
                            commentDiv.appendChild(cImg);
                        }
                        let pComment = document.createElement('p');
                        pComment.classList.add('comment-text');
                        pComment.textContent = document.querySelector(`#p${allNums[n]}`).textContent;
                        commentDiv.appendChild(pComment);
                        commentDiv.addEventListener('mouseleave', () => {
                            let popUp = document.querySelector('.pop-up');
                            popUp.remove();
                        });
                        commentDiv.style.top = `${e.pageY}px`;
                        let parent = document.getElementsByClassName('comment-text')[0];
                        parent.prepend(commentDiv);
                        let genDiv = document.querySelector(`.pop-up`);
                        genDiv.style.top = ((document.body.scrollHeight - e.pageY) < genDiv.clientHeight) ? `${e.pageY - genDiv.clientHeight}px` : `${e.pageY}px`;
                        genDiv.style.left = ((e.pageX/window.innerWidth) > 0.5) ? `${e.pageX - genDiv.clientWidth}px`: `${e.pageX}px`;
                    }
                } 
            })

            // When the mouse leaves the quote, the pop-up is removed
            allQuotes[o].addEventListener('mouseleave', () => {
                let popDown = document.querySelector('.pop-up');
                popDown.remove();
            })            
        }
    }

    // This section adds a pop-up with the same properties as the pop-ups in the previous section, but these are exclusive to comments that are quoted in different comment sections (and thus on different pages). The comment previews will simply say "This comment is in another thread". 

    let foreignQs = document.getElementsByClassName('another-thread');
    for (let o = 0; o < foreignQs.length; o++){
        foreignQs[o].addEventListener('mouseover', (e) => {
            let check = document.querySelector('.pop-up');
            if (check === null){
                let commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-divs');
                commentDiv.classList.add('pop-up');
                let pComment = document.createElement('p');
                pComment.classList.add('comment-text-foreign');
                pComment.textContent = "This comment is in another thread";
                commentDiv.appendChild(pComment);
                commentDiv.addEventListener('mouseleave', () => {
                    let popUp = document.querySelector('.pop-up');
                    popUp.remove();
                })
                let parent = document.getElementsByClassName('comment-text')[0];
                parent.prepend(commentDiv);
                let genDiv = document.querySelector(`.pop-up`);
                genDiv.style.top = ((document.body.scrollHeight - e.pageY) < genDiv.clientHeight) ? `${e.pageY - genDiv.clientHeight}px` : `${e.pageY}px`;
                genDiv.style.left = ((e.pageX/window.innerWidth) > 0.5) ? `${e.pageX - genDiv.clientWidth}px`: `${e.pageX}px`;
            } 
        })
        foreignQs[o].addEventListener('mouseleave', () => {
            let popDown = document.querySelector('.pop-up');
            popDown.remove();
        })            
    }

    // This section adds a replies section to each comment that has replies, and fills it with links to those replies along with mouseover previews similar to the ones in the previous section. It does this by looping through the comsWithQuotes array, which is an array of arrays with length two. The first element of each sub-array is the number of the comment making the reply, while the second is the number of the comment being replied to. Duplicate replies have been removed. 
    
    // For each comment that has replies, the replies section is unhidden, and for each comment that replied to it, it is appended below the comment with the same bold red text of the double numbers sign followed by the comment number. The same mouseover/mouseleave event listeners are added as with regular comments.

    comsWithQuotes.forEach((com) => {

        // Does not evaluate foreign comments.
        if (allComs.indexOf(com[1]) !== -1){
            let pReplies = document.querySelector(`#s${com[1]}`)
            pReplies.classList.remove('hide');
            let div = document.querySelector(`#r${com[1]}`);
            let p = document.createElement('p');
            p.classList.add('post-quotes-mini');
            p.classList.add(`hr${com[0]}`);
            p.classList.add('post-quotes-mini-p');
            p.innerHTML =`<a class="post-quotes-mini" href=#c${com[0]}>##</a>${com[0]}`;
            p.addEventListener('mouseover', (e) => {
                let check = document.querySelector('.pop-up');
                if (check === null){
                    if (document.querySelector(`#id${com[0]}`) === null){
                        let commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment-divs');
                        commentDiv.classList.add('pop-up');
                        let infoDiv = document.createElement('div');
                        infoDiv.classList.add('comment-info-div');
                        let pName = document.createElement('p');
                        pName.classList.add('comment-name-badge');
                        pName.textContent = document.querySelector(`#n${com[0]}`).textContent;
                        pName.style.color = document.querySelector(`#n${com[0]}`).style.color;
                        let getBadge = document.querySelector(`#bad${com[0]}`);
                        let badge = document.createElement('img');
                        badge.classList.add('op-badges-mini');
                        badge.src = getBadge.src;
                        let pDate = document.createElement('p');
                        pDate.classList.add('comment-date-badge');
                        pDate.textContent = document.querySelector(`#d${com[0]}`).textContent;
                        let pId = document.createElement('p');
                        pId.classList.add('comment-id');
                        pId.classList.add('comment-numbers');
                        pId.textContent = document.querySelector(`#i${com[0]}`).textContent;
                        infoDiv.appendChild(pName);
                        infoDiv.appendChild(badge);
                        infoDiv.appendChild(pId);
                        commentDiv.appendChild(infoDiv);
                        let img = document.querySelector(`#img${com[0]}`);
                        if (img !== null){
                            let cImg = document.createElement('img');
                            cImg.src = img.src
                            cImg.classList.add('quote-avatar-images');
                            commentDiv.appendChild(cImg);
                        }
                        let pComment = document.createElement('p');
                        pComment.classList.add('comment-text');
                        pComment.textContent = document.querySelector(`#p${com[0]}`).textContent;
                        commentDiv.appendChild(pComment);
                        commentDiv.addEventListener('mouseleave', () => {
                            let popUp = document.querySelector('.pop-up');
                            popUp.remove();
                        });
                        commentDiv.style.top = `${e.pageY}px`;
                        let parent = document.getElementsByClassName('comment-text')[0];
                        parent.prepend(commentDiv);
                        let genDiv = document.querySelector(`.pop-up`);
                        genDiv.style.top = ((document.body.scrollHeight - e.pageY) < genDiv.clientHeight) ? `${e.pageY - genDiv.clientHeight}px` : `${e.pageY}px`;
                        genDiv.style.left = ((e.pageX/window.innerWidth) > 0.5) ? `${e.pageX - genDiv.clientWidth}px`: `${e.pageX}px`;
                    } else {
                        let commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment-divs');
                        commentDiv.classList.add('pop-up');
                        commentDiv.classList.add(`pop${com[0]}`);
                        let infoDiv = document.createElement('div');
                        infoDiv.classList.add('comment-info-div');
                        let pName = document.createElement('p');
                        pName.classList.add('comment-name');
                        pName.textContent = document.querySelector(`#n${com[0]}`).textContent;
                        let pDate = document.createElement('p');
                        let getId = document.querySelector(`#idc${com[0]}`);
                        let pCId = document.createElement('p');
                        pCId.classList.add('comment-author-id');
                        pCId.innerHTML = `(ID: <span style="font-weight: bold; background: ${getId.style.background}; color: black;">${getId.textContent}</span>)`;
                        pDate.classList.add('comment-date');
                        pDate.textContent = document.querySelector(`#d${com[0]}`).textContent;
                        let pId = document.createElement('p');
                        pId.classList.add('comment-id');
                        pId.classList.add('comment-numbers');
                        pId.innerHTML = document.querySelector(`#i${com[0]}`).textContent;
                        infoDiv.appendChild(pName);
                        infoDiv.appendChild(pCId);
                        infoDiv.appendChild(pId);
                        commentDiv.appendChild(infoDiv);
                        let img = document.querySelector(`#img${com[0]}`);
                        if (img !== null){
                            let cImg = document.createElement('img');
                            cImg.src = img.src
                            cImg.classList.add('quote-avatar-images');
                            commentDiv.appendChild(cImg);
                        }
                        let pComment = document.createElement('p');
                        pComment.classList.add('comment-text');
                        pComment.textContent = document.querySelector(`#p${com[0]}`).textContent;
                        commentDiv.appendChild(pComment);
                        commentDiv.addEventListener('mouseleave', () => {
                            let popUp = document.querySelector('.pop-up');
                            popUp.remove();
                        })
                        let parent = document.getElementsByClassName('comment-text')[0];
                        parent.prepend(commentDiv);
                        let genDiv = document.querySelector(`.pop${com[0]}`);
                        genDiv.style.top = ((document.body.scrollHeight - e.pageY) < genDiv.clientHeight) ? `${e.pageY - genDiv.clientHeight}px` : `${e.pageY}px`;
                        genDiv.style.left = ((e.pageX/window.innerWidth) > 0.5) ? `${e.pageX - genDiv.clientWidth}px`: `${e.pageX}px`;
                    }
                } 
            })
            p.addEventListener('mouseleave', () => {
                let popDown = document.querySelector('.pop-up');
                popDown.remove();
            })
            div.appendChild(p);
        }      
    })
}

parsePosts();

// This function adds functionality to the report button for the main image. First, it grabs the image ID and stores it in a variable called "id". Then, it adds an event listener to the report button that will toggle the reporting options when clicked. Then, it adds event listeners to the report options spam, porn, and other, respectively. If the user selects the porn or spam buttons, a post request will be made to the /reports/posts/:id endpoint, and the report section will disappear. If the user selects "other", a textbox will pop up that allows the user to enter in a custom report up to 200 characters. When the user clicks "submit", their custom report is sent in a post request and the report section is removed.

function reportButtonsPosts(){
    let id = document.querySelector('#h2-image-id').textContent.split('#')[1];
    reportButton.addEventListener('click', () => {
        reportButton.classList.toggle('report-button-selected');
        buttonsDiv.classList.toggle('hide'); 
    })
    let buttonsDiv = document.querySelector(`#post-report-reasons${id}`);
    let reportButton = document.querySelector(`#post-report${id}`);
    if (buttonsDiv !== null){
        let spam = document.querySelector(`#post-report-spam${id}`);
        spam.addEventListener('click', () => {
            let fd = new FormData();
            fd.append('commentNumber', id);
            fd.append("reason", "spam");
            if (document.querySelector(`#span-posted-by`) === null){
                fd.append("postName", document.querySelector(`#span-posted-by-badge`).textContent);
            } else {
                fd.append("postName", document.querySelector(`#span-posted-by`).textContent);
            }
            fd.append("postDate", document.querySelector(`#op-post-date`).textContent);
            if (document.querySelector('#manifesto-text') === null){
                fd.append("postText", null)
            } else {
                fd.append("postText", (document.querySelector(`#manifesto-text`).textContent.length > 120) ? document.querySelector(`#manifesto-text`).textContent.substr(0, 120) + "..." : document.querySelector(`#manifesto-text`).textContent);
            }
            fd.append("additionalInfo", null);
            axios.post(`https://nanaimg.net/reports/posts/${id}`, fd)
                .then(res => {
                })
                .catch(err => {
                })
            let reportSent = document.createElement('p');
            reportSent.textContent = "Report sent";
            reportSent.classList.add("p-post-report-sent");
            document.querySelector(`#post-report-section`).appendChild(reportSent);
            buttonsDiv.remove();
            reportButton.remove();
        })
        let porn = document.querySelector(`#post-report-porn${id}`);
        porn.addEventListener('click', () => {
            let fd = new FormData();
            fd.append('commentNumber', id);
            fd.append("reason", "porn");
            if (document.querySelector(`#span-posted-by`) === null){
                fd.append("postName", document.querySelector(`#span-posted-by-badge`).textContent);
            } else {
                fd.append("postName", document.querySelector(`#span-posted-by`).textContent);
            }
            fd.append("postDate", document.querySelector(`#op-post-date`).textContent);
            if (document.querySelector('#manifesto-text') === null){
                fd.append("postText", null)
            } else {
                fd.append("postText", (document.querySelector(`#manifesto-text`).textContent.length > 120) ? document.querySelector(`#manifesto-text`).textContent.substr(0, 120) + "..." : document.querySelector(`#manifesto-text`).textContent);
            }
            fd.append("additionalInfo", null);
            axios.post(`https://nanaimg.net/reports/posts/${id}`, fd)
                .then(res => {
                })
                .catch(err => {
                })
            let reportSent = document.createElement('p');
            reportSent.textContent = "Report sent";
            reportSent.classList.add("p-post-report-sent");
            document.querySelector(`#post-report-section`).appendChild(reportSent);
            buttonsDiv.remove();
            reportButton.remove();
        })
        let other = document.querySelector(`#post-report-other${id}`);
        other.addEventListener('click', () => {
            if (document.querySelector(`#post-textarea${id}`) === null){
                let reportDiv = document.querySelector(`#post-report-reasons${id}`);
                let textarea = document.createElement('textarea');
                textarea.classList.add('textarea-report-comment');
                textarea.setAttribute("id", `post-textarea${id}`);
                textarea.setAttribute("placeholder", "(200 chars max)");
                reportDiv.appendChild(textarea);
                let buttonsDivOther = document.createElement('div');
                buttonsDivOther.classList.add('report-buttons-div-other');
                buttonsDivOther.setAttribute("id", `post-buttonsDiv${id}`);
                let submitButton = document.createElement('button');
                submitButton.classList.add('comment-report-buttons-other');
                submitButton.textContent = "Submit";
                submitButton.addEventListener('click', () => {
                    if (document.querySelector(`#post-textarea${id}`).value.length > 200){
                        let p = document.createElement('p');
                        p.textContent = "Your report is too long (max: 200 characters)";
                        p.classList.add('p-report-error');
                        document.querySelector(`#post-report-reasons${id}`).appendChild(p);
                    } else {
                        let fd = new FormData();
                        fd.append('commentNumber', id);
                        fd.append("reason", "other");
                        if (document.querySelector(`#span-posted-by`) === null){
                            fd.append("postName", document.querySelector(`#span-posted-by-badge`).textContent);
                        } else {
                            fd.append("postName", document.querySelector(`#span-posted-by`).textContent);
                        }
                        fd.append("postDate", document.querySelector(`#op-post-date`).textContent);
                        if (document.querySelector('#manifesto-text') === null){
                            fd.append("postText", null)
                        } else {
                            fd.append("postText", (document.querySelector(`#manifesto-text`).textContent.length > 120) ? document.querySelector(`#manifesto-text`).textContent.substr(0, 120) + "..." : document.querySelector(`#manifesto-text`).textContent);
                        }
                        fd.append("additionalInfo", document.querySelector(`#post-textarea${id}`).value);
                        axios.post(`https://nanaimg.net/reports/posts/${id}`, fd)
                            .then(res => {
                            })
                            .catch(err => {
                            })
                        let reportSent = document.createElement('p');
                        reportSent.textContent = "Report sent";
                        reportSent.classList.add("p-post-report-sent");
                        document.querySelector(`#post-report-section`).appendChild(reportSent);
                        buttonsDivOther.remove();
                        reportDiv.remove();
                        document.querySelector(`#post-report${id}`).remove();
                    }
                })
                let cancelButton = document.createElement('button');
                cancelButton.classList.add('comment-report-buttons-other');
                cancelButton.classList.add('comment-report-buttons-other-cancel');
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", () => {
                    document.querySelector(`#post-textarea${id}`).remove();
                    document.querySelector(`#post-buttonsDiv${id}`).remove();
                    document.querySelector(".p-report-error").remove();
                })
                buttonsDivOther.appendChild(submitButton);
                buttonsDivOther.appendChild(cancelButton);
                reportDiv.appendChild(buttonsDivOther);
            } else {
                document.querySelector(`#post-textarea${id}`).remove();
                document.querySelector(`#post-buttonsDiv${id}`).remove();  
                document.querySelector(".p-report-error").remove(); 
            }
        }) 
        
    }
}

reportButtonsPosts();

// This function adds the ability for a moderator or administrator to remove images. The functionality is exactly the same as the report button, except the user is redirected to the removed image after it is removed.

function removeButtonsPosts(){
    let id = document.querySelector('#h2-image-id').textContent.split('#')[1];
    let spam = document.querySelector(`#post-remove-confirm${id}`);
    let porn = document.querySelector(`#post-remove-porn${id}`);
    let buttonsDiv = document.querySelector(`#post-remove-options${id}`);
    if (buttonsDiv !== null){
        spam.addEventListener('click', () => {
            let fd = new FormData();
            fd.append("reason", "spam");
            axios.post(`https://nanaimg.net/reports/post/remove/${id}`, fd)
                .then(res => {
                    window.location.href = `https://nanaimg.net/image/${id}`;
                })
                .catch(err => {
                    console.log(err)
                })
            
        })
        porn.addEventListener('click', () => {
            let fd = new FormData();
            fd.append("reason", "porn");
            axios.post(`https://nanaimg.net/reports/post/remove/${id}`, fd)
                .then(res => {
                    window.location.href = `https://nanaimg.net/image/${id}`;
                })
                .catch(err => {
                    console.log(err)
                })
        })
        let other = document.querySelector(`#post-remove-options-btn${id}`);
        other.addEventListener('click', () => {
            if (document.querySelector(`#rp-textarea${id}`) === null){
                let reportDiv = document.querySelector(`#post-remove-options${id}`);
                let textarea = document.createElement('textarea');
                textarea.classList.add('textarea-report-comment');
                textarea.setAttribute("id", `rp-textarea${id}`);
                textarea.setAttribute("placeholder", "(200 chars max)");
                reportDiv.appendChild(textarea);
                let buttonsDivOther = document.createElement('div');
                buttonsDivOther.classList.add('report-buttons-div-other');
                buttonsDivOther.setAttribute("id", `rp-buttonsDiv${id}`);
                let submitButton = document.createElement('button');
                submitButton.classList.add('comment-report-buttons-other');
                submitButton.textContent = "Submit";
                submitButton.addEventListener('click', () => {
                    if (document.querySelector(`#rp-textarea${id}`).value.length > 200){
                        let p = document.createElement('p');
                        p.textContent = "Your reason is too long (max: 200 characters)";
                        p.classList.add('p-report-error');
                        document.querySelector(`#post-remove-options${id}`).appendChild(p);
                    } else {
                        let fd = new FormData();
                        let fdReason = (document.querySelector(`#rp-textarea${id}`).value.length > 0) ? document.querySelector(`#rp-textarea${id}`).value : "Other";
                        fd.append("reason", fdReason);
                        axios.post(`https://nanaimg.net/reports/post/remove/${id}`, fd)
                            .then(res => {
                                window.location.href = `https://nanaimg.net/image/${id}`;
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        
                    }
                })
                let cancelButton = document.createElement('button');
                cancelButton.classList.add('comment-report-buttons-other');
                cancelButton.classList.add('comment-report-buttons-other-cancel');
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", () => {
                    document.querySelector(`#rp-textarea${id}`).remove();
                    document.querySelector(`#rp-buttonsDiv${id}`).remove();  
                    if (document.querySelector(".p-report-error") !== null){
                        document.querySelector(".p-report-error").remove();
                    }
                })
                buttonsDivOther.appendChild(submitButton);
                buttonsDivOther.appendChild(cancelButton);
                reportDiv.appendChild(buttonsDivOther);
            } else {
                document.querySelector(`#rp-textarea${id}`).remove();
                document.querySelector(`#rp-buttonsDiv${id}`).remove();  
                if (document.querySelector(".p-report-error") !== null){
                    document.querySelector(".p-report-error").remove();
                }
            }
        })  
        let removeButton = document.querySelector(`#post-remove${id}`);
        removeButton.addEventListener('click', () => {
            removeButton.classList.toggle('report-button-selected');
            buttonsDiv.classList.toggle('hide'); 
        })
    }
}

removeButtonsPosts();

// This function allows admins and moderators to remove manifestos. It functions exactly the same as removing images, except for there is no option to remove for porn.

function removeButtonsManifesto(){
    let id = document.querySelector('#h2-image-id').textContent.split('#')[1];
    let spam = document.querySelector(`#manifesto-remove-confirm${id}`);
    let porn = document.querySelector(`#manifesto-remove-porn${id}`);
    let buttonsDiv = document.querySelector(`#manifesto-remove-options${id}`);
    if (buttonsDiv !== null){
        spam.addEventListener('click', () => {
            let fd = new FormData();
            fd.append("reason", "spam");
            axios.post(`https://nanaimg.net/reports/manifesto/remove/${id}`, fd)
                .then(res => {
                })
                .catch(err => {
                })
            window.location.href = `https://nanaimg.net/image/${id}`;
        })
        let other = document.querySelector(`#manifesto-remove-options-btn${id}`);
        other.addEventListener('click', () => {
            if (document.querySelector(`#rm-textarea${id}`) === null){
                let reportDiv = document.querySelector(`#manifesto-remove-options${id}`);
                let textarea = document.createElement('textarea');
                textarea.classList.add('textarea-report-comment');
                textarea.setAttribute("id", `rm-textarea${id}`);
                textarea.setAttribute("placeholder", "(200 chars max)");
                reportDiv.appendChild(textarea);
                let buttonsDivOther = document.createElement('div');
                buttonsDivOther.classList.add('report-buttons-div-other');
                buttonsDivOther.setAttribute("id", `rm-buttonsDiv${id}`);
                let submitButton = document.createElement('button');
                submitButton.classList.add('comment-report-buttons-other');
                submitButton.textContent = "Submit";
                submitButton.addEventListener('click', () => {
                    if (document.querySelector(`#rm-textarea${id}`).value.length > 200){
                        let p = document.createElement('p');
                        p.textContent = "Your reason is too long (max: 200 characters)";
                        p.classList.add('p-report-error');
                        document.querySelector(`#manifesto-remove-options${id}`).appendChild(p);
                    } else {
                        let fd = new FormData();
                        let fdReason = (document.querySelector(`#rm-textarea${id}`).value.length > 0) ? document.querySelector(`#rm-textarea${id}`).value : "Other";
                        fd.append("reason", fdReason);
                        axios.post(`https://nanaimg.net/reports/manifesto/remove/${id}`, fd)
                            .then(res => {
                            })
                            .catch(err => {
                            })
                        window.location.href = `https://nanaimg.net/image/${id}`;
                    }
                })
                let cancelButton = document.createElement('button');
                cancelButton.classList.add('comment-report-buttons-other');
                cancelButton.classList.add('comment-report-buttons-other-cancel');
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", () => {
                    document.querySelector(`#rm-textarea${id}`).remove();
                    document.querySelector(`#rm-buttonsDiv${id}`).remove();  
                    if (document.querySelector(".p-report-error") !== null){
                        document.querySelector(".p-report-error").remove();
                    }
                })
                buttonsDivOther.appendChild(submitButton);
                buttonsDivOther.appendChild(cancelButton);
                reportDiv.appendChild(buttonsDivOther);
            } else {
                document.querySelector(`#rm-textarea${id}`).remove();
                document.querySelector(`#rm-buttonsDiv${id}`).remove();  
                if (document.querySelector(".p-report-error") !== null){
                    document.querySelector(".p-report-error").remove();
                }
            }
        })  
        let removeButton = document.querySelector(`#manifesto-remove${id}`);
        removeButton.addEventListener('click', () => {
            removeButton.classList.toggle('report-button-selected');
            buttonsDiv.classList.toggle('hide'); 
        })
    }
}

removeButtonsManifesto();

// This function allows admins and moderators to remove comments. It starts by initializing an array with the ids of all of the comments. Then, for each element in the array, it adds an event listener to each of the remove buttons which displays the two remove options - spam and other. The rest works exactly the same as the remove buttons for the manifesto.

function removeButtonsComments(){
    let postNumbers = posts.map((post) => {
        return post.textContent.split('#')[1];
    })
    for (let i = 0; i < postNumbers.length; i++){
        let id = postNumbers[i];
        let spam = document.querySelector(`#remove-confirm${id}`);
        let buttonsDiv = document.querySelector(`#remove-options${id}`);
        if (buttonsDiv !== null){
            spam.addEventListener('click', () => {
                let fd = new FormData();
                fd.append("reason", "spam");
                axios.post(`https://nanaimg.net/reports/comment/remove/${postNumbers[i]}`, fd)
                    .then(res => {
                    })
                    .catch(err => {
                    })
                let removed = document.createElement('p');
                removed.textContent = "Comment removed";
                removed.classList.add("p-comment-report-sent");
                document.querySelector(`#c${postNumbers[i]}`).appendChild(removed);
                buttonsDiv.remove();
                document.querySelector(`#remove${postNumbers[i]}`).remove();
            })
            let other = document.querySelector(`#remove-options-btn${postNumbers[i]}`);
            other.addEventListener('click', () => {
                if (document.querySelector(`#rc-textarea${postNumbers[i]}`) === null){
                    let reportDiv = document.querySelector(`#remove-options${postNumbers[i]}`);
                    let textarea = document.createElement('textarea');
                    textarea.classList.add('textarea-report-comment');
                    textarea.setAttribute("id", `rc-textarea${postNumbers[i]}`);
                    textarea.setAttribute("placeholder", "(200 chars max)");
                    reportDiv.appendChild(textarea);
                    let buttonsDivOther = document.createElement('div');
                    buttonsDivOther.classList.add('report-buttons-div-other');
                    buttonsDivOther.setAttribute("id", `rc-buttonsDiv${postNumbers[i]}`);
                    let submitButton = document.createElement('button');
                    submitButton.classList.add('comment-report-buttons-other');
                    submitButton.textContent = "Submit";
                    submitButton.addEventListener('click', () => {
                        if (document.querySelector(`#rc-textarea${postNumbers[i]}`).value.length > 200){
                            let p = document.createElement('p');
                            p.textContent = "Your reason is too long (max: 200 characters)";
                            p.classList.add('p-report-error');
                            document.querySelector(`#remove-options${postNumbers[i]}`).appendChild(p);
                        } else {
                            let fd = new FormData();
                            let fdReason = (document.querySelector(`#rc-textarea${postNumbers[i]}`).value.length > 0) ? document.querySelector(`#rc-textarea${postNumbers[i]}`).value : "Other";
                            fd.append("reason", fdReason);
                            axios.post(`https://nanaimg.net/reports/comment/remove/${postNumbers[i]}`, fd)
                                .then(res => {
                                })
                                .catch(err => {
                                })
                            let reportSent = document.createElement('p');
                            reportSent.textContent = "Comment removed";
                            reportSent.classList.add("p-comment-report-sent");
                            document.querySelector(`#c${postNumbers[i]}`).appendChild(reportSent);
                            buttonsDivOther.remove();
                            reportDiv.remove();
                            document.querySelector(`#report${postNumbers[i]}`).remove();
                            document.querySelector(`#remove${postNumbers[i]}`).remove();
                        }
                    })
                    let cancelButton = document.createElement('button');
                    cancelButton.classList.add('comment-report-buttons-other');
                    cancelButton.classList.add('comment-report-buttons-other-cancel');
                    cancelButton.textContent = "Cancel";
                    cancelButton.addEventListener("click", () => {
                        document.querySelector(`#rc-textarea${postNumbers[i]}`).remove();
                        document.querySelector(`#rc-buttonsDiv${postNumbers[i]}`).remove();  
                        if (document.querySelector(".p-report-error") !== null){
                            document.querySelector(".p-report-error").remove();
                        }
                    })
                    buttonsDivOther.appendChild(submitButton);
                    buttonsDivOther.appendChild(cancelButton);
                    reportDiv.appendChild(buttonsDivOther);
                } else {
                    document.querySelector(`#rc-textarea${postNumbers[i]}`).remove();
                    document.querySelector(`#rc-buttonsDiv${postNumbers[i]}`).remove();  
                    if (document.querySelector(".p-report-error") !== null){
                        document.querySelector(".p-report-error").remove();
                    }
                }
            })  
            let removeButton = document.querySelector(`#remove${id}`);
            removeButton.addEventListener('click', () => {
                removeButton.classList.toggle('report-button-selected');
                buttonsDiv.classList.toggle('hide'); 
            })
        }
    }
}

removeButtonsComments();

// This function adds a restore button to all of the removed comments. Similar to the report button, the user clicks "restore", then can either confirm or cancel. If the user clicks "confirm", the restore button disappears and the comment is restored.

function restoreButtonsComments(){
    let postNumbers = posts.map((post) => {
        return post.textContent.split('#')[1];
    })
    for (let i = 0; i < postNumbers.length; i++){
        let id = postNumbers[i];
        let confirm = document.querySelector(`#restore-confirm${id}`);
        let buttonsDiv = document.querySelector(`#restore-options${id}`);
        if (buttonsDiv !== null){
            confirm.addEventListener('click', () => {
                axios.post(`https://nanaimg.net/reports/comment/${id}`)
                    .then(res => {
                        let removeP = document.createElement('p');
                        removeP.classList.add('p-comment-removed');
                        removeP.textContent = "Comment restored";
                        document.querySelector(`#c${id}`).appendChild(removeP);
                        document.querySelector(`#restore${id}`).remove();
                        document.querySelector(`#restore-options${id}`).remove();
                    })
                    .catch(err => {
                    })
            })
            let cancel = document.querySelector(`#restore-cancel${id}`);
            cancel.addEventListener('click', () => {
                restoreButton.classList.toggle('report-button-selected');
                buttonsDiv.classList.toggle('hide'); 
            })
            let restoreButton = document.querySelector(`#restore${id}`);
            restoreButton.addEventListener('click', () => {
                restoreButton.classList.toggle('report-button-selected');
                buttonsDiv.classList.toggle('hide'); 
            })
        }
    }
}

restoreButtonsComments();

// This function works exactly the same as restoreButtonsComments, except for the fact that after the user confirms the restoration of the manifesto, the page reloads and the restore button is replaced with report and remove buttons.

function restoreButtonsManifesto(){
    let id = document.querySelector('#h2-image-id').textContent.split('#')[1];
    let confirm = document.querySelector(`#manifesto-restore-confirm${id}`);
    let buttonsDiv = document.querySelector(`#manifesto-restore-options${id}`);
    if (buttonsDiv !== null){
        confirm.addEventListener('click', () => {
            axios.post(`https://nanaimg.net/reports/manifesto/restore/${id}`)
                .then(res => {
                    window.location.href = `https://nanaimg.net/image/${id}`;
                })
                .catch(err => {
                })
        })
        let cancel = document.querySelector(`#manifesto-restore-cancel${id}`);
        cancel.addEventListener('click', () => {
            restoreButton.classList.toggle('report-button-selected');
            buttonsDiv.classList.toggle('hide'); 
        })
        let restoreButton = document.querySelector(`#manifesto-restore${id}`);
        restoreButton.addEventListener('click', () => {
            restoreButton.classList.toggle('report-button-selected');
            buttonsDiv.classList.toggle('hide'); 
        })
    }
}


restoreButtonsManifesto();

// This function restores removed images, and works exactly the same as restoreButtonsManifesto.

function restoreButtonsPosts(){
    let id = document.querySelector('#h2-image-id').textContent.split('#')[1];
    let confirm = document.querySelector(`#post-restore-confirm${id}`);
    let buttonsDiv = document.querySelector(`#post-restore-options${id}`);
    if (buttonsDiv !== null){
        confirm.addEventListener('click', () => {
            axios.post(`https://nanaimg.net/reports/post/${id}`)
                .then(res => {
                    window.location.href = `https://nanaimg.net/image/${id}`;
                })
                .catch(err => {
                })
        })
        let cancel = document.querySelector(`#post-restore-cancel${id}`);
        cancel.addEventListener('click', () => {
            restoreButton.classList.toggle('report-button-selected');
            buttonsDiv.classList.toggle('hide'); 
        })
        let restoreButton = document.querySelector(`#post-restore${id}`);
        restoreButton.addEventListener('click', () => {
            restoreButton.classList.toggle('report-button-selected');
            buttonsDiv.classList.toggle('hide'); 
        })
    }
}

restoreButtonsPosts();

// This function allows users to report comments, and works the same as removeButtonsComments

function reportButtonsComments(){
    const postNumbers = posts.map((post) => {
        return post.textContent.split('#')[1];
    })
    for (let i = 0; i < postNumbers.length; i++){
        let buttonsDiv = document.querySelector(`#report-reasons${postNumbers[i]}`);
        let spam = document.querySelector(`#report-spam${postNumbers[i]}`);
        if (buttonsDiv !== null){
            spam.addEventListener('click', () => {
                let fd = new FormData();
                fd.append('commentNumber', postNumbers[i]);
                fd.append("reason", "spam");
                fd.append("postName", document.querySelector(`#n${postNumbers[i]}`).textContent);
                fd.append("postDate", document.querySelector(`#d${postNumbers[i]}`).textContent);
                fd.append("postText", (document.querySelector(`#p${postNumbers[i]}`).textContent.length > 120) ? document.querySelector(`#p${postNumbers[i]}`).textContent.substr(0, 120) + "..." : document.querySelector(`#p${postNumbers[i]}`).textContent);
                fd.append("additionalInfo", null);
                axios.post(`https://nanaimg.net/reports/comments/${postNumbers[i]}`, fd)
                    .then(res => {
                    })
                    .catch(err => {
                    })
                let reportSent = document.createElement('p');
                reportSent.textContent = "Report sent";
                reportSent.classList.add("p-comment-report-sent");
                document.querySelector(`#c${postNumbers[i]}`).appendChild(reportSent);
                buttonsDiv.remove();
                reportButton.remove();
            })
            let other = document.querySelector(`#report-other${postNumbers[i]}`);
            other.addEventListener('click', () => {
                if (document.querySelector(`#textarea${postNumbers[i]}`) === null){
                    let reportDiv = document.querySelector(`#report-reasons${postNumbers[i]}`);
                    let textarea = document.createElement('textarea');
                    textarea.classList.add('textarea-report-comment');
                    textarea.setAttribute("id", `textarea${postNumbers[i]}`);
                    textarea.setAttribute("placeholder", "(200 chars max)");
                    reportDiv.appendChild(textarea);
                    let buttonsDivOther = document.createElement('div');
                    buttonsDivOther.classList.add('report-buttons-div-other');
                    buttonsDivOther.setAttribute("id", `buttonsDiv${postNumbers[i]}`);
                    let submitButton = document.createElement('button');
                    submitButton.classList.add('comment-report-buttons-other');
                    submitButton.textContent = "Submit";
                    submitButton.addEventListener('click', () => {
                        if (document.querySelector(`#textarea${postNumbers[i]}`).value.length > 200){
                            let p = document.createElement('p');
                            p.textContent = "Your report is too long (max: 200 characters)";
                            p.classList.add('p-report-error');
                            document.querySelector(`#report-reasons${postNumbers[i]}`).appendChild(p);
                        } else {
                            let fd = new FormData();
                            fd.append('commentNumber', postNumbers[i]);
                            fd.append("reason", "other");
                            fd.append("postName", document.querySelector(`#n${postNumbers[i]}`).textContent);
                            fd.append("postDate", document.querySelector(`#d${postNumbers[i]}`).textContent);
                            fd.append("postText", (document.querySelector(`#p${postNumbers[i]}`).textContent.length > 120) ? document.querySelector(`#p${postNumbers[i]}`).textContent.substr(0, 120) + "..." : document.querySelector(`#p${postNumbers[i]}`).textContent);
                            fd.append("additionalInfo", document.querySelector(`#textarea${postNumbers[i]}`).value);
                            axios.post(`https://nanaimg.net/reports/comments/${postNumbers[i]}`, fd)
                                .then(res => {
                                })
                                .catch(err => {
                                })
                            let reportSent = document.createElement('p');
                            reportSent.textContent = "Report sent";
                            reportSent.classList.add("p-comment-report-sent");
                            document.querySelector(`#c${postNumbers[i]}`).appendChild(reportSent);
                            buttonsDivOther.remove();
                            reportDiv.remove();
                            document.querySelector(`#report${postNumbers[i]}`).remove();
                        }
                    })
                    let cancelButton = document.createElement('button');
                    cancelButton.classList.add('comment-report-buttons-other');
                    cancelButton.classList.add('comment-report-buttons-other-cancel');
                    cancelButton.textContent = "Cancel";
                    cancelButton.addEventListener("click", () => {
                        document.querySelector(`#textarea${postNumbers[i]}`).remove();
                        document.querySelector(`#buttonsDiv${postNumbers[i]}`).remove();
                        if (document.querySelector(".p-report-error") !== null){
                            document.querySelector(".p-report-error").remove();
                        }
                    })
                    buttonsDivOther.appendChild(submitButton);
                    buttonsDivOther.appendChild(cancelButton);
                    reportDiv.appendChild(buttonsDivOther);
                } else {
                    document.querySelector(`#textarea${postNumbers[i]}`).remove();
                    document.querySelector(`#buttonsDiv${postNumbers[i]}`).remove();  
                    if (document.querySelector(".p-report-error") !== null){
                        document.querySelector(".p-report-error").remove();
                    }
                }
            })  
            let reportButton = document.querySelector(`#report${postNumbers[i]}`);
            reportButton.addEventListener('click', () => {
                reportButton.classList.toggle('report-button-selected');
                buttonsDiv.classList.toggle('hide');
            })
        }
    }
}

reportButtonsComments();