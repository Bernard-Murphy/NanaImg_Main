/* Function that saves a small amount of typing when creating menus that allow the user to select which badge they
want displayed when they post images or comments. */

function pickBadge(pick){
    if (pick === '0'){
        return 'https://nanaimg.net/assets/chadminmel.png'
    } else if (pick === '1'){
        return 'https://nanaimg.net/assets/spaceedge.png'
    } else if (pick === '2'){
        return 'https://nanaimg.net/assets/verifiedbadge.png'
    } else {
        return '0'
    }
}

module.exports = pickBadge;