const cardHTML = document.getElementById("card")

fetch("./database.json")
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
                    <p>${viaje.desCorta}</p>
                    <h2 class="precio">desde $${viaje.precioA}</h2>
                    <button class="text_btn" id="text_btn">Conocé más</button>
                    <div class="mostrar">
                        <p>${viaje.desLarga}</p>
                    <button class="text_btn1" id="text_btn1">Ocultar</button>
                    <div>
                </div>`;
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
    })

   