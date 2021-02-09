// Used when rendering image pages that have users with badges. This will determine the font-color of their names depending on which badge they have.

function getBadgeColor(badge){
    if (badge === 'https://nanaimg.net/assets/chadminmel.png'){
        return 'rgb(193, 150, 0)'
    } else if (badge === 'https://nanaimg.net/assets/spaceedge.png'){
        return 'rgb(34, 177, 76)'
    } else if (badge === 'https://nanaimg.net/assets/verifiedbadge.png'){
        return 'rgb(0, 162, 232)'
    } else {
        return "black"
    }
}

module.exports = getBadgeColor;