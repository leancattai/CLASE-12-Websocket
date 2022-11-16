const socket = io.connect();

function renderProductList(productos) {
  const stock = productos.length > 0;

  const product = productos.map((producto) => {
    return `
      <tr>
          <td>${producto.title}</td>
          <td>${producto.price}</td>
          <td>
            <img
              src="${producto.thumbnail}"
              style="width: 30px; height: 30px;"
            />
          </td>
      </tr>
      `;
  });

  if (stock) {
    document.getElementById("tablaProductos").innerHTML = `
    <table class="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Foto</th>
          </tr>
        </thead>
        <tbody id="tableList">
        </tbody>
    </table>
  `;
    document.getElementById("tableList").innerHTML = product;
  } else {
    document.getElementById("tablaProductos").innerHTML = `
      <div class="noStock">
        <h3>No se encontraron productos</h3>
      </div>
      `;
  }
}

function renderMensajes(mensajes) {
  const msgs = mensajes
    .map((msg) => {
      return `
        <div class="mensaje">
          <strong>${msg.author}</strong>
          <p>[${msg.fecha}]: </p>
          <em>${msg.text}</em>
        </div>
        `;
    })
    .join(" ");
  document.getElementById("mensajes").innerHTML = msgs;
}

socket.on("productos", (productos) => renderProductList(productos));
socket.on("mensajes", (mensajes) => renderMensajes(mensajes));

function agregarProducto() {
  const inputTitle = document.getElementById("inputTitle");
  const inputPrice = document.getElementById("inputPrice");
  const inputThumbnail = document.getElementById("inputThumbnail");

  if (inputTitle.value && inputPrice.value && inputThumbnail.value) {
    const product = {
      title: inputTitle.value,
      price: inputPrice.value,
      thumbnail: inputThumbnail.value,
    };
    socket.emit("nuevoProducto", product);
  } else {
    alert("Debe llenar todos los campos para cargar un producto");
  }
}

function agregarMensajes() {
  const inputEmail = document.getElementById("email");
  const inputTexto = document.getElementById("texto");

  if (inputEmail.value && inputTexto.value) {
    const mensaje = {
      author: inputEmail.value,
      text: inputTexto.value,
    };
    socket.emit("nuevoMensaje", mensaje);
  } else {
    alert("Debe llenar todos los campos para cargar un producto");
  }
}
