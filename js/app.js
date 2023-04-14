 //menu responsive
 const navToggle = document.querySelector(".nav-toggle");
 const navMenu = document.querySelector(".nav-menu");
 
 navToggle.addEventListener("click", () => {
   navMenu.classList.toggle("nav-menu_visible");
 
   if (navMenu.classList.contains("nav-menu_visible")) {
     navToggle.setAttribute("aria-label", "Cerrar menú");
   } else {
     navToggle.setAttribute("aria-label", "Abrir menú");
   }
 });
 // Esconder el menu cuando seleccionamos una opcion
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("nav-menu_visible");
    navToggle.setAttribute("aria-label", "Abrir menu");
  });
});
//Tarjetas dinamicas, cargadas con datos de database.json
const cardHTML = document.getElementById("card")

fetch("./db/database.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(viaje => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            tarjeta.innerHTML = `            
                <div class="encabezado-tarjeta">
                    <img src=${viaje.imagen}>    
                    <h2 class="destino">${viaje.nombre}</h2>
                </div>
                <div>
                    <p>${viaje.desCorta}</p></br>
                    <p>Precios</p>
                    <h3>Adultos :  <strong>$${viaje.precioA}</strong></h3>
                    <h3>Menores :  <strong>$${viaje.precioM}</strong></h3></br>
                    <button class="text_btn" id="text_btn">Conocé más</button>
                    <div class="mostrar">
                    <p>${viaje.desLarga}</p></br>
                    <button class="text_btn1" id="text_btn1">Ocultar</button>
                    <div>
                </div>
                `;
                cardHTML.appendChild(tarjeta);
                const stext_btn = tarjeta.querySelector('.text_btn');
                const smostrar = tarjeta.querySelector('.mostrar');
                const smostraM = tarjeta.querySelector('.text_btn1')
                stext_btn.addEventListener('click', ()=>{
                    smostrar.style.display= 'block';
                    stext_btn.style.display= 'none';
                    smostraM.style.display = 'block';
                });
                smostraM.addEventListener('click', ()=>{
                    smostrar.style.display = 'none';
                    smostraM.style.display = 'none';
                    stext_btn.style.display = 'block';
                })
        
        });
    });

    

//cotizador de paquetes turisticos
const origenSelect = document.getElementById("selectProvincias");

function Provincias() {
  fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then((response) => response.json())
    .then((json) => {//traigo los datos de la api y los guardo en una const para recorrerlo con un map y poder ordenarlos alfabeticamente
      const provincias = json.provincias.map(provincia=>provincia.nombre);
      provincias.sort();
      provincias.forEach(nombre => {//recorro la misma api para crear un option en el select
        const option = document.createElement("option");
        option.value = nombre;
        option.text = nombre;
        origenSelect.add(option);//agrego la option al select con el value y texto de igual valor
      });
    });
}

Provincias();

const form1 = document.getElementById("formulario");
const origen = document.getElementById("selectProvincias");
const selectPaquete = document.getElementById("selectPaquete");
const adultosInput = document.getElementById("adultos");
const menoresInput = document.getElementById("menores");
const resultadoTotal = document.getElementById("total");
const errorMensaje = document.querySelectorAll(".error-mensaje");


let paquetes;
// guardo el json en un variable
async function CargarPaquetes() {
  const response = await fetch("./db/database.json");
   paquetes = await response.json();
// agrego los paquetes por nombre al select
  paquetes.forEach((pqt) => {
    const option = document.createElement("option");
    option.value = pqt.id;
    option.textContent = pqt.nombre;
    selectPaquete.appendChild(option);
  });
}

function calcularPrecio() {
//tomo lo valores ingresados en el formulario para realizar el calculo 
  const origenProv = origen.value;
  const paqueteId = selectPaquete.value;
  const adultos = adultosInput.value;
  const menores = menoresInput.value;

//busco que me traiga los datos del mismo paquete seleccionado previamente
  const paquete = paquetes.find((pkg) => pkg.id == paqueteId);
  const precioA = paquete.precioA;
  const precioM = paquete.precioM;
  const precio = precioA * adultos + precioM * menores;
  const modal = document.getElementById("Modal");
  const closeModal = document.querySelector(".close");
  const downloadButton = document.getElementById("download-button");
  const editButton = document.getElementById("edit-button");
  const jsPDF = window.jspdf.jsPDF;
  const precioTotal = precio.toFixed(2);
  resultadoTotal.innerHTML = `
        <p>Precio total para ${adultos} adultos</p><br>
        <p>y ${menores} menores, </p><br>
        <p>partiendo desde ${origenProv}</p><br>
        <p>con el paquete ${paquete.nombre},</p><br>
        <p>precio total : $${precioTotal}</p><br>`;
  modal.style.display = "block";


  //funcion para descargar el pdf con un formato muy basico
  downloadButton.addEventListener("click", () => {
    const doc = new jsPDF();
    const imgPdf='./imagenes/norturismopdf.jpg';
    doc.addImage(imgPdf, 'JPEG', 30, 0, 150, 100);
    doc.text(`PRESUPUESTO DEL MEJOR VIAJE PARA VOS :`,60,80)
    doc.text(`Cotizacion partiendo desde :     ${origenProv}`,60,100);
    doc.text(`Con destino a  :                 ${paquete.nombre}`,60,120)
    doc.text(`Cantidad de  Adultos :           ${adultos}`,60,140)
    doc.text(`Cantidad de  Menores :           ${menores}`,60,160)
    doc.text(`Precio Total:                    $${precioTotal}`, 60, 180);
    doc.text(`-Presenta este presupuesto en tu agencia de viaje-`, 40, 220);
    doc.save("cotizacion.pdf");
  });
 


  

  
//funcion para editar la consulta
  editButton.addEventListener("click", () => {
    modal.style.display = "none";
    document.getElementById("selectProvincias").value = origen;
    document.getElementById("selectPaquete").value = paquete;
    document.getElementById("adultos").value = adultos;
    document.getElementById("menores").value = menores;
  });
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

//llamo a la funcion cargar paquetes y si esta cargado busco el evento click para realizar el calculo de cotizacion
CargarPaquetes().then(()=>{
  const calcularBtn = document.getElementById('calcular-button');
  calcularBtn.addEventListener('click', calcularPrecio);
})

//validacion del formulario de contacto a traves de expresiones regulares
const form = document.getElementById('contact');

const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const comentarios = document.getElementById('comentarios');

const nombreReg = /^[a-zA-Z\s]*$/;
const emailReg = /^\S+@\S+\.\S+$/;
const telefonoReg = /^\d{10}$/;

form.addEventListener('submit', (event) => {
	event.preventDefault();
	let valid = true;
	
	// Valido el  nombre
	if (!nombreReg.test(nombre.value)) {
	  nombre.classList.add('invalid');
	  nombre.nextElementSibling.textContent = 'Ingresar un nombre valido';
	  valid = false;
	} else {
	  nombre.classList.remove('invalid');
	  nombre.nextElementSibling.textContent = '';
	}
	
	// Valido el  mail
	if (!emailReg.test(email.value)) {
	  email.classList.add('invalid');
	  email.nextElementSibling.textContent = 'Ingrese un mail valido';
	  valid = false;
	} else {
	  email.classList.remove('invalid');
	  email.nextElementSibling.textContent = '';
	}
	
	// Valido el  telefono
	if (!telefonoReg.test(telefono.value)) {
	  telefono.classList.add('invalid');
	  telefono.nextElementSibling.textContent = 'Ingresar un telefono valido';
	  valid = false;
	} else {
	  telefono.classList.remove('invalid');
	  telefono.nextElementSibling.textContent = '';
	}
	
	// Submit el formulario si todos los campos son validos y muestra un mensaje de enviado exitosamente que desaparece a los 5 segundos
	if (valid) {
	  form.reset();
    document.getElementById('boton-enviar').classList.add('boton-enviar-ocultar');
    document.getElementById('mensaje-exito').classList.add('mensaje-exito-activo');
		setTimeout(() => {
			document.getElementById('mensaje-exito').classList.remove('mensaje-exito-activo');
      document.getElementById('boton-enviar').classList.remove('boton-enviar-ocultar');
		}, 5000);
	}
  });

