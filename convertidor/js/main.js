document.addEventListener("readystatechange",cargarEventos,false);
function cargarEventos(){
    cargarSeleccion();
    cargarLista();
    document.getElementById("datosConversion").addEventListener("change",conversion)
    document.getElementById("datosConversion").addEventListener("change",cargarSeleccion);
    document.getElementById("datoIntroducido").addEventListener("keyup",conversion);
    document.getElementById("revertir").addEventListener("click",revertirConversion);
    document.getElementById("guardar").addEventListener("click",guardar);
}

//Array con los datos de las conversiones
var conversiones={"km-mi":0.621371,"mi-km":1.60934,"ft-m ":0.3048,"m -ft":3.28084,"cm-in":0.393701,"in-cm":2.54};


/*
    La funcion cargarSeleccion lo que hace es que al seleccionar un option del select, se cogan esos valores para poder
    ponerlos en la pagina
*/

function cargarSeleccion(){
    var seleccion=document.getElementById("datosConversion");
    var valorSeleccion=seleccion[seleccion.selectedIndex].value;
    document.getElementById("formatoIntroducido").innerHTML=valorSeleccion.substr(0,2)
    document.getElementById("formatoConversion").innerHTML=valorSeleccion.substr(-2,2)
    console.log(seleccion[seleccion.selectedIndex].value);
}

/*
    La funcion cargarLista comprueba en el localStorage "conversiones" que es lo que almacena las conversiones guardadas
    por el usuario y las pone en la pagina
*/

function cargarLista(){
    document.getElementById("datosGuardados").innerHTML="";
    var datos=JSON.parse(localStorage.getItem("conversiones"));
    if(datos!=null){
        for(var i=0;i<datos.length;i++){
            var cadena=datos[i].split("&")
                document.getElementById("datosGuardados").innerHTML+=
        `<div class="dato"><span>${cadena[1]}</span><button class="borrar" id="${cadena[0]}">X</button></div>`
        }        
    }
    borrar()
}

/*
    La funcion conversion revisa la conversion seleccionada en el select y con el array de las conversiones realiza
    el calculo con los datos introducidos
*/


function conversion(){
    var seleccion=document.getElementById("datosConversion");
    var valorSeleccion=seleccion[seleccion.selectedIndex].value;
    var datoConvertir=document.getElementById("datoIntroducido").value
    var conversor=conversiones[valorSeleccion];
    document.getElementById("resultadoConversion").innerHTML=(datoConvertir*conversor).toFixed(2);
    document.getElementById("formatoConversion").innerHTML=" "+valorSeleccion.substr(-2,2)
}

/*
    La funcion revertirConversion se encarga de cambiar de posicion el dato que hay en el input y el formato que tiene
    con el que da como resultado
*/


function revertirConversion(){
    var aux=document.getElementById("resultadoConversion").innerHTML;
    document.getElementById("resultadoConversion").innerHTML=document.getElementById("datoIntroducido").value
    document.getElementById("datoIntroducido").value=aux;
    var cadenaAux=document.getElementById("formatoConversion").innerHTML;
    document.getElementById("formatoConversion").innerHTML=document.getElementById("formatoIntroducido").innerHTML
    document.getElementById("formatoIntroducido").innerHTML=cadenaAux;

}

/*
    La funcion de guardar nos crea una cadena con el momento actual por si el usuario crea una misma conversion varias veces para que no haya
    conflictos al borrar. Se comprueba en el localStorage "conversiones" que contiene las conversiones anteriores y se agregan. Luego se agregan
    a la pagina 
*/


function guardar(){
    var cadenaGuardar=document.getElementById("datoIntroducido").value+" "
                      +document.getElementById("formatoIntroducido").innerHTML+" → "
                      +document.getElementById("resultadoConversion").innerHTML+" "
                      +document.getElementById("formatoConversion").innerHTML;
    var momentoActual=Date.now().toString();
    var cadenaFinal=momentoActual+"&"+cadenaGuardar;
    var datosGuardar=[cadenaFinal];
    if(localStorage.getItem('conversiones')==undefined){
        localStorage.setItem('conversiones',JSON.stringify(datosGuardar));
    }else{
        var aux=JSON.parse(localStorage.getItem('conversiones'))
        aux.push(cadenaFinal)
        localStorage.setItem('conversiones',JSON.stringify(aux));
    }
    document.getElementById("datosGuardados").innerHTML+=
    `<div class="dato"><span>${cadenaGuardar}</span><button class="borrar" id="${momentoActual}">X</button></div>`
    borrar();
}

/*
    La funcion de borrar se encarga de borrar cada conversion con el id unico que tienen cada una
*/

function borrar(){
    var listaBotonesBorrar=document.querySelectorAll(".borrar");
    for (let i = 0; i < listaBotonesBorrar.length; i++) {
        listaBotonesBorrar[i].addEventListener("click", (evento) => {
            const id = evento.currentTarget.id;
            var aux=JSON.parse(localStorage.getItem('conversiones'))
            var nuevoArray=[];
            for (let i = 0; i < aux.length; i++) {
                var cadenaAux=(aux[i].split("&"));
                if (cadenaAux[0] !== id) {
                    nuevoArray.push(aux[i]);
                }
            }
            localStorage.setItem('conversiones',JSON.stringify(nuevoArray));
            cargarLista();
        });
    }
}
