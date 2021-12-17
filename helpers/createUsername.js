module.exports = function(fullname) {
  let words = fullname.split(' ');
  let codeName = words.map(el => `${el[0].toLowerCase()}${el.slice(1).toLowerCase()}`);
  
  return codeName.join('_');
}
