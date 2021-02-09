
/* Generates a simple 8 character id that allows some but not all characters. Used for images and comments from 
   anonymous users  */
function getId() {
    var id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_~';
    for (let i = 0; i < 8; i++) {
       id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
 }

 module.exports = getId;