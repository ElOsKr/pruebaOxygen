/*
    Coloris es la herramienta que he usado para la paleta de colores
    la inicializo con unos colores predeterminados, tema oscuro, que se vea de forma vertical
    y no poder modificar la opacidad de los colores
*/
Coloris({
    el: '.coloris',
    swatches: [
      '#264653',
      '#2a9d8f',
      '#e9c46a',
      '#f4a261',
      '#e76f51',
      '#d62828',
      '#023e8a',
      '#0077b6',
      '#0096c7',
      '#00b4d8',
      '#48cae4'
    ]
  });

Coloris.setInstance('.selectorColores', {
    formatToggle: true,
    themeMode:'dark',
    defaultColor: '#479DBE',
    theme: 'polaroid',
    alpha: false,
  });


document.addEventListener("readystatechange",cargarEventos,false);
function cargarEventos(){
    seleccionCirculo();
    cargarLista();
    document.getElementById("agregarPaleta").addEventListener("click",guardarColores)
}  

/*
    Funcion de seleccion de Circulo es para agregar el efecto de que se haga mas grande el circulo al seleccionarlo
    y tambien que se le agregue el color al circulo seleccionado
    Cada vez que cambiamos de circulo se le agregan o quitan propiedades de css para hacer el efecto de seleccion
*/


function seleccionCirculo(){
    var listaBotonesColores=document.querySelectorAll(".circuloVacio");
    var aux;
    for (let i = 0; i < listaBotonesColores.length; i++) {
        listaBotonesColores[i].classList.remove("circuloVacio-focus")
        listaBotonesColores[i].addEventListener("click", (evento) => {
            for (let i = 0; i < listaBotonesColores.length; i++) {
                listaBotonesColores[i].classList.remove("circuloVacio-focus")
            }
            aux=evento.currentTarget;
            document.getElementById(aux.id).classList.add("circuloVacio-focus");
            document.addEventListener('coloris:pick', event => {
            document.getElementById(aux.id).style.background=event.detail.color
            aux.dataset.modificado="si";
            });
        });
    }
}

/*
    Funcion de guardar colores lo primero que hace es validar que este el nombre de la paleta, una vez validado,
    creo una cadena con el momento actual que me servira como clave (por si el usuario crea una paleta con el mismo
    nombre y mismos colores que no haya conflictos al borrar), guardo el nombre de la paleta y los colores en un array
    y compruebo que exista en el localStorage el objeto 'paletaColores' para guardar ahi los colores del usaurio. Una vez
    guardados creo el div que contiene el nombre y la paleta de colores, borrando los colores de arriba.
*/

function guardarColores(){
    var nombrePaleta=document.getElementById("nombre").value;
    if(nombrePaleta==null || nombrePaleta==""){
        document.getElementById("errorTexto").innerHTML="Debe introducir un nombre"
    }else{
        document.getElementById("errorTexto").innerHTML=""
        var momentoActual=Date.now().toString();
        var arrayColores=[];
        var datosGuardar=[];
        var cadenaClave=momentoActual+"&"+nombrePaleta;
        var listaBotonesColores=document.querySelectorAll(".circuloVacio");
        for (let i = 0; i < listaBotonesColores.length; i++) {
            var arrayAux=[];
            arrayAux.push(listaBotonesColores[i].dataset.modificado,listaBotonesColores[i].style.background)
            arrayColores.push(arrayAux);
        }
        if(localStorage.getItem('paletaColores')==undefined){
            var datos=[cadenaClave,arrayColores];
            datosGuardar.push(datos);
            localStorage.setItem('paletaColores',JSON.stringify(datosGuardar));
        }else{
            var aux=JSON.parse(localStorage.getItem('paletaColores'))
            var datos=[cadenaClave,arrayColores]
            aux.push(datos)
            localStorage.setItem('paletaColores',JSON.stringify(aux));
        }
        document.getElementById("datosGuardados").innerHTML+=
        `   <div class="dato">
            <p>${nombrePaleta}<button class="borrar" id="${cadenaClave}"><i class="fa-regular fa-trash-can"></i></button></p>
            </div>
            `; 
            var cajaColores=document.createElement("div")
            for (let i = 0; i < arrayColores.length; i++) {
                if(arrayColores[i][1]==""){
                    cajaColores.innerHTML+=`
                        <span class="circuloRelleno"></span>
                        `
                }else{
                    cajaColores.innerHTML+=`
                    <span class="circuloRelleno" style="background: ${arrayColores[i][1]}"></span>
                    `
                }
            }
        document.getElementById(cadenaClave).parentElement.parentElement.appendChild(cajaColores);
        cajaColores.classList.add("datosColores")
    }

    var listaBotonesColores=document.querySelectorAll(".circuloVacio");
    for (let i = 0; i < listaBotonesColores.length; i++) {
        listaBotonesColores[i].classList.remove("circuloVacio-focus");
        listaBotonesColores[i].dataset.modificado="no";
        listaBotonesColores[i].style.background="";

    }
    borrar();
    seleccionPaleta();

}

/*
    La funcion de cargar lista comprueba el localStorage de 'paletaColores' para ver los colores que hay.
    Una vez los tenemos, se van agregando a la pagina.
*/


function cargarLista(){
    document.getElementById("datosGuardados").innerHTML="";
    var datos=JSON.parse(localStorage.getItem("paletaColores"));
    if(datos!=null){
        for(var i=0;i<datos.length;i++){
            var cadena=datos[i][0].split("&")
            document.getElementById("datosGuardados").innerHTML+=
            `   <div class="dato">
                <p>${cadena[1]}<button class="borrar" id="${datos[i][0]}"><i class="fa-regular fa-trash-can"></i></button></p>
                </div>
                `; 
                var cajaColores=document.createElement("div");
                var dato;
                for (let j = 0; j < datos[i][1].length; j++) {
                    dato=datos[i][1][j][1];
                    if(dato==""){
                        cajaColores.innerHTML+=`
                            <span class="circuloRelleno"></span>
                            `
                    }else{
                        cajaColores.innerHTML+=`
                        <span class="circuloRelleno" style="background: ${datos[i][1][j][1]}"></span>
                        `
                    }
                }
                document.getElementById(datos[i][0]).parentElement.parentElement.appendChild(cajaColores);
                cajaColores.classList.add("datosColores")
        }        
    }
    borrar();
    seleccionPaleta();
}

/*
    La funcion de borrar agrega a los botones de borrado el evento para que cuando se haga click en ellos,
    con el id unico que tienen cada unos se acceda con ese id al localStorage y se borre
*/

function borrar(){
    var listaBotonesColores=document.querySelectorAll(".borrar");
    for (let i = 0; i < listaBotonesColores.length; i++) {
        listaBotonesColores[i].addEventListener("click", (evento) => {
            const id = evento.currentTarget.id;
            var aux=JSON.parse(localStorage.getItem('paletaColores'))
            var nuevoArray=[];
            for (let i = 0; i < aux.length; i++) {
                var cadenaAux=(aux[i][0]);
                if (cadenaAux !== id) {
                    nuevoArray.push(aux[i]);
                }
            }
            localStorage.setItem('paletaColores',JSON.stringify(nuevoArray));
            cargarLista();
            evento.stopPropagation();
        });
    }
}

/*
    La seleccion de la paleta va recorriendo cada uno de los colores que hay en la paleta y los agrega a los circulos
    de los colores que hay en la parte superior de la pagina
*/


function seleccionPaleta(){
    var listaPaletaColores=document.querySelectorAll(".dato");
    for (let i = 0; i < listaPaletaColores.length; i++) {
        listaPaletaColores[i].addEventListener("click", (evento) => {
            var arrayColores=[]
            for (let j = 0; j < listaPaletaColores[i].childNodes[3].childNodes.length; j++) {
                if(listaPaletaColores[i].childNodes[3].childNodes[j].nodeName=="SPAN"){
                    arrayColores.push(listaPaletaColores[i].childNodes[3].childNodes[j].style.background)
                }
            }
            var listaBotonesVacios=document.querySelectorAll(".circuloVacio");
            for (let i = 0; i < listaBotonesVacios.length; i++) {
                listaBotonesVacios[i].style.background=arrayColores[i];
            }
        });
    }
}
