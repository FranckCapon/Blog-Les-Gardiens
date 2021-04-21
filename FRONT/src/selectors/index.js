/**
 * fonction qui recherche l'id dans le tableau reçu
 * @param {Array} array
 * @param {string} slug
 * @return{object | undifined}
 */
export const findIdBySlug = (array, id) => array.find((item) => item.id == id);

/**
 * fonction qui choisit 3 id au hasard et renvoie les données du tableau reçu
 * @param {array} array
 */

export const randomArray = (array) => {
  // on choisit 3 id au hasard
  console.log("Array", array);
  const newArray = [];
  do {
    const id = Math.floor(Math.random() * array.length);
    const same = newArray.find(element => element.id === array[id].id);
    console.log("same :", same);
    console.log("randomArray", newArray);
    console.log("Array Length :", newArray.length);
    console.log("Insert: ", array[id])
    newArray.push(array[id]);
    console.log("id", id)
  } while (newArray.length < 2);
  return array;
};

/**
 * fonction qui renvoi l'id le plus grand
 * @param {array} array
 */
export const getHighestId = (array) => {
  const ids = array.map((item) => item.id);
  const maxID = ids.length === 0 ? 0 : Math.max(...ids);
  return maxID;
};

/**
 * fonction qui choisit dans le tableau l'id max et renvoie les données associées
 */

export const lastArray = (array) => {
  const newLastArray = [];
  const maxId = getHighestId(array);
  // on trouve les données correspondant à l'id

  newLastArray.push(array.find((item) => item.id == maxId));
  return newLastArray;
};

/**
 * fonction permettant de créer une preview
 * @param {Array} array - le tableau d'objet auquel on veut rajouté une preview
 */
export const getPreview = (array) => {
  for (const props of array) {
    props.preview = props.description.split(" ").splice(0, 30).join(' ');
  }
  return array;
};
