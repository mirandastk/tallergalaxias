
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

btnBuscar.addEventListener('click', () => {
  const search = inputBuscar.value.trim();

  if (search) {
    buscarImagenes(search);
  }
});

function buscarImagenes(search) {
  const url = `https://images-api.nasa.gov/search?q=${search}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      mostrarImagenes(data.collection.items);
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
      contenedor.innerHTML = '<p>Hubo un error al obtener los datos. Por favor, intenta nuevamente.</p>';
    });
}

function mostrarImagenes(items) {
    contenedor.innerHTML = ''; 
  
    if (items.length === 0) {
      contenedor.innerHTML = '<p>No se encontraron resultados para esta búsqueda.</p>';
      return;
    }
  
    items.forEach(item => {
      const { data, links } = item;
      const titulo = data[0].title || 'Sin título';
      const descripcion = data[0].description || 'Sin descripción';
      const fecha = new Date(data[0].date_created).toLocaleDateString() || 'Fecha no disponible';
      const imagenUrl = links && links[0] && links[0].href ? links[0].href : 'https://via.placeholder.com/300';

      
    const cardHTML = `
        <div class="col-lg-4 col-md-6 mb-4">
        <div class="card">
            <img src="${imagenUrl}" class="card-img-top" alt="${titulo}">
            <div class="card-body">
            <h5 class="card-title">${titulo}</h5>
            <p class="card-text">${descripcion}</p>
            </div>
            <div class="card-footer text-muted">
            ${fecha}
            </div>
        </div>
    </div>
    `;

    contenedor.innerHTML += cardHTML;
    });
}
  
document.getElementById("formBuscar").addEventListener("submit", function(event) {//se arma el evento del submit
  event.preventDefault(); // se evita que se recargue la página automaticamente, sirve para manejar la busqueda sin perder el contenido actual
  const query = document.getElementById("inputBuscar").value.trim(); //se obtiene el texto ingresado en el campo de búsqueda

  if (query) { //si se ingresó un valor en el campo de búsqueda
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
 //se construye la url para la api, encodeURIComponent convierte los caracteres especiales o espacios para que funcione la url 
    fetch(url) // Realiza la solicitud a la API
      .then(response => response.json()) // Convierte la respuesta a JSON
      .then(data => {
        const images = data.collection.items; // extrae los elementos de la colección
        const contenedor = document.getElementById("contenedor");
        contenedor.innerHTML = images.length  // se crea una tarjeta 
        ? images.map(image => {
          const imgSrc = image.links[0].href; // Obtiene la URL de la imagen
          const title = image.data[0].title; // Obtiene el título de la imagen
          const description = image.data[0].description || "Descripción no disponible"; // Obtiene la descripción
          const date = image.data[0].date_created ? new Date(image.data[0].date_created).toLocaleDateString() : "Fecha no disponible"; // Obtiene la fecha

          return `
            <div class="col-md-4 col-lg-3 mb-4">
              <div class="card shadow-sm">
                <img src="${imgSrc}" class="card-img-top" alt="${title}">
                <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">${description}</p>
                  <p class="card-text"><small class="text-muted">Fecha: ${date}</small></p>
                </div>
              </div>
            </div>
          `;
        }).join("")
      : "<p>No se encontraron resultados.</p>"; // Muestra un mensaje si no hay resultados
  })
      
      .catch(error => console.error("Error al obtener imágenes:", error)); // Maneja errores
  }
});
