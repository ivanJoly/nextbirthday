/* Inicializo Arrays principales*/
const months_arr = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const day_arr = [31,28,31,30,31,30,31,31,30,31,30,31];

/* Inicializo array de dias */
let day_initial_arr = [];
for (let index = 1; index <= 31; index++) {
    day_initial_arr.push(index);
}

/* Funcion callback que se ejecuta cuando el container de meses se actualiza*/
let dayCallback = function(){

    /* Buscamos el mes seleccionado */
    let month = month_Picker.selected();
    let index = months_arr.findIndex(el => el == month);
    
    /*Obtenemos la posicion del mes en el array y la comparamos con a de los dias*/
    let days = day_arr[index];
    let half = Math.round(days / 2)

    let array_temp = [];

    for (let index = 1; index <= days; index++) {
        array_temp.push(index)
    }

    let day_temp = month_Picker.format(array_temp);
    
    /* Cerramos el container + actualizamos la data*/
    day_Picker.close();
    day_Picker.refresh(day_temp);

}

let monthCallback = function(){
    month_Picker.close();
}

/* Generamos ambos Pickers*/

/*
Reciben por parametro
    1.Array de elementos
    2.Nombre del picker
    3.Id donde apendear el picker
    4.Funcion de callback por si necesitamos una respuesta a un update
*/

const month_Picker = new Picker(months_arr, 'month', 'month-picker', dayCallback);
const day_Picker = new Picker(day_initial_arr, 'day', 'day-picker', monthCallback);