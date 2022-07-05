
module.exports = getDate;

function getDate() {
    let options = {
        weekday :"long",
        day : "numeric",
        month : "short",
        year : "numeric"
    };
    
    let today = new Date();
    return today.toLocaleDateString("en-US",options);

}