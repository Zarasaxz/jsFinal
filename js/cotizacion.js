let usuarios = [];
let ingresos = [];

let formulario;
let inputNombre;
let inputApellido;
let inputdni;
let inputEdad;
let tabla;
let datosRegistros;
let btnVaciar;
let btnImpr;
let btnAdd;
let formSelect;
let inputCasas;
let inputAdults;
let inputChildren;
let listaDetalles;
let ingreso;
let totalAPagar;
const d = document;

function main() {
  inicializarElementos();
  inicializarEventos();
  extraerLogin();
  agregarTotalDetalles();
  obtenerUsuariosLocalStorage();
  agregarUsuariosTabla();
  vaciarLogica();
  botonImprimir();
}

class Usuarios {
  constructor(ID, nombre, apellido, dni, edad) {
    this.ID = ID;
    this.nombre = nombre.toUpperCase();
    this.apellido = apellido.toUpperCase();
    this.dni = dni;
    this.edad = edad;
  }
}
class Ingresos {
  constructor(casas, adults, children, total) {
    this.casas = casas;
    this.adults = adults;
    this.children = children;
    this.total = total;
  }
}

function inicializarElementos() {
  formulario = d.getElementById("formulario");
  inputNombre = d.getElementById("inputNombre");
  inputApellido = d.getElementById("inputApellido");
  inputdni = d.getElementById("inputdni");
  inputEdad = d.getElementById("inputEdad");
  tabla = d.getElementById("tablaUsuarios");
  datosRegistros = d.getElementById("datosRegistros");
  btnVaciar = d.getElementById("btnVaciar");
  btnImpr = d.getElementById("btnImpr");
  formSelect = d.getElementById("formSelect");
  inputCasas = d.getElementById("inputCasas");
  inputAdults = d.getElementById("inputAdults");
  inputChildren = d.getElementById("inputChildren");
  listaDetalles = d.getElementById("listaDetalles");
  btnAdd = d.getElementById("btnAdd");
  totalAPagar = d.getElementById("totalAPagar");
}

function inicializarEventos() {
  formulario.onsubmit = (e) => validarFormulario(e);
  formSelect.onsubmit = (e) => validarIngresos(e);
}

function validarIngresos(e) {
  e.preventDefault();
  let casas = parseInt(inputCasas.value);
  let adults = parseInt(inputAdults.value);
  let children = parseInt(inputChildren.value);
  let total = adults + children;
  let ingreso = new Ingresos(casas, adults, children, total);

  const validaCasas = () => {
    casas === ""
      ? setErrorFor(inputCasas, "El número de casas no puede estar vacío.")
      : total >= 7 && casas === 1
      ? setErrorFor(
          inputCasas,
          "El máximo de personas es 6, si desea más debe arrendar 2 casas."
        )
      : total >= 13 && casas === 2
      ? setErrorFor(
          inputCasas,
          "El máximo de personas es 12, si desea más debe contactar a la administración."
        )
      : setSuccessFor(inputCasas);
  };
  validaCasas(casas);

  const validaAdults = () => {
    adults < 1
      ? setErrorFor(inputAdults, "El número de adultos no puede estar vacío")
      : total >= 7 && casas <= 1
      ? setErrorFor(
          inputAdults,
          "No se puede ingresar más adultos, supera el máximo."
        )
      : total >= 13 && casas <= 2
      ? setErrorFor(
          inputAdults,
          "No se puede ingresar más adultos, supera el máximo."
        )
      : setSuccessFor(inputAdults);
  };
  validaAdults(adults);

  const validaChildren = () => {
    children === ""
      ? setErrorFor(inputChildren, "Ingrese 0.")
      : total >= 7 && casas <= 1
      ? setErrorFor(
          inputChildren,
          "No se puede ingresar más, supera el máximo."
        )
      : total >= 13 && casas <= 2
      ? setErrorFor(
          inputChildren,
          "No se puede ingresar más, supera el máximo."
        )
      : setSuccessFor(inputChildren);
  };
  validaChildren(children);

  if (total === 0 || (total >= 7 && casas === 1)) {
    alertError();
  } else if (total >= 13 && casas === 2) {
    alertError();
  } else {
    ingresos.push(ingreso);
    agregarTotalDetalles();
    AgregarTotalDinero();
    limpiarIngresosTotales();
    limpiarPrecioTotal();
    const Toast = Swal.mixin({
      toast: true,
      background: "#f7e6ba",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      title: "Total agregado correctamente",
    });
  }
}

function validarFormulario(e) {
  e.preventDefault();
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let dni = inputdni.value;
  let edad = parseInt(inputEdad.value);
  let ID = 0;
  while (ID < usuarios.length) {
    ID++;
  }
  let usuario = new Usuarios(ID, nombre, apellido, dni, edad);

  const validaNombre = () => {
    nombre === ""
      ? setErrorFor(inputNombre, "El nombre no puede estar vacío.")
      : (nombre = !isLetters(nombre)
          ? setErrorFor(inputNombre, "Debes escribir el nombre.")
          : nombre.length < 3
          ? setErrorFor(
              inputNombre,
              "El nombre debe tener al menos 3 caracteres."
            )
          : nombre.length > 20
          ? setErrorFor(
              inputNombre,
              "El nombre debe tener máximo 20 caracteres."
            )
          : setSuccessFor(inputNombre));
  };
  validaNombre(nombre);

  const validaApellido = () => {
    apellido === ""
      ? setErrorFor(inputApellido, "El apellido no puede estar vacío.")
      : (apellido = !isLetters(apellido)
          ? setErrorFor(inputApellido, "Debes escribir el apellido.")
          : apellido.length < 3
          ? setErrorFor(
              inputApellido,
              "El apellido debe tener al menos 3 caracteres."
            )
          : apellido.length > 20
          ? setErrorFor(
              inputApellido,
              "El apellido debe tener máximo 20 caracteres."
            )
          : setSuccessFor(inputApellido));
  };
  validaApellido(apellido);

  const validadni = () => {
    dni === ""
      ? setErrorFor(inputdni, "El documento no puede estar vacío.")
      : setSuccessFor(inputdni);
  };
  validadni(dni);

  const validaEdad = () => {
    edad === ""
      ? setErrorFor(inputEdad, "La edad no puede estar vacía.")
      : edad <= 0
      ? setErrorFor(inputEdad, "La edad debe ser mayor a 0.")
      : edad > 100
      ? setErrorFor(inputEdad, "La edad debe ser menor a 100.")
      : setSuccessFor(inputEdad);
  };
  validaEdad(edad);

  if (
    usuarios !== "" &&
    isLetters(nombre) &&
    isLetters(apellido) &&
    !isdni(dni) &&
    edad > 0 &&
    edad <= 100
  ) {
    usuarios.push(usuario);
    formulario.reset();
    limpiarTabla();
    agregarUsuariosTabla();
    almacenarUsuariosLocalStorage();
    const Toast = Swal.mixin({
      toast: true,
      background: "#f7e6ba",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      title: "Agregado correctamente",
    });
  } else {
    alertError();
  }
}

function agregarTotalDetalles() {
  ingresos.forEach((ingreso) => {
    let Detalle = d.createElement("ul");
    Detalle.innerHTML = `
        <li>Cantidad de casas: ${ingreso.casas}</li>
        <li>Adultos: ${ingreso.adults}</li>
        <li>Niños: ${ingreso.children}</li>
        <li>Total ingresos: ${ingreso.total}</li>
        `;
    listaDetalles.appendChild(Detalle);
  });
}

const AgregarTotalDinero = () => {
  ingresos.forEach((ingreso) => {
    let spanTotal = d.createElement("p");
    totalP = 40 * ingreso.casas;
    spanTotal.innerHTML = `
        <span><strong>Total a pagar: $${totalP}.000</strong></span>
        `;
    totalAPagar.appendChild(spanTotal);
  });
};

function agregarUsuariosTabla() {
  usuarios.forEach((usuario) => {
    let filaTabla = d.createElement("tr");
    filaTabla.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.dni}</td>
            <td>${usuario.edad}</td>`;
    tabla.tBodies[0].append(filaTabla);
  });
}

function limpiarTabla() {
  while (tabla.rows.length > 1) {
    tabla.deleteRow(1);
  }
}

function limpiarIngresosTotales() {
  while (listaDetalles.children.length > 1) {
    listaDetalles.removeChild(listaDetalles.firstChild);
  }
}

function limpiarPrecioTotal() {
  while (totalAPagar.children.length > 1) {
    totalAPagar.removeChild(totalAPagar.firstChild);
  }
}

function almacenarUsuariosLocalStorage() {
  localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
}

function obtenerUsuariosLocalStorage() {
  let usuariosAlmacenados = localStorage.getItem("listaUsuarios");
  usuariosAlmacenados === null
    ? (usuarios = [])
    : (usuarios = JSON.parse(usuariosAlmacenados));
}

function renderizarDetalle() {
  limpiarTabla();
}

function vaciarLogica() {
  btnVaciar.addEventListener("click", () => {
    Swal.fire({
      title: "¿Estás seguro que quieres vaciar la lista?",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      denyButtonText: `Cancelar`,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Lista vacía", "", "success");
        vaciarUsuariosLocalStorage();
      }
    });
  });
}

function vaciarUsuariosLocalStorage() {
  usuarios = [];
  ingresos = [];
  listaDetalles.innerHTML = "";
  totalAPagar.innerHTML = "";
  renderizarDetalle();
  localStorage.removeItem("listaUsuarios");
}

function printDiv() {
  let divContents = d.getElementById("imprimir").innerHTML;
  let a = window.open("", "", "height=900, width=900");
  a.d.write(divContents);
  a.d.close();
  a.print();
}

function botonImprimir() {
  btnImpr.addEventListener("click", () => {
    Swal.fire({
      title: "¿Deseas finalizar la cotización e imprimir?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      denyButtonText: `Cancelar`,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        printDiv();
        let boleta = Math.floor(Math.random() * 1000000);
        Swal.fire({
          title: "COTIZACIÓN N" + boleta,
          text: "¡Gracias por usar nuestros servicios!",
          icon: "success",
        });
        setTimeout(() => {
          vaciarUsuariosLocalStorage();
          localStorage.removeItem("userList");
          window.location.href = "../index.html";
        }, 6000);
      }
    });
  });
}

main();
