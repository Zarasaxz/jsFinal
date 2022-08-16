function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = message;

  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function isEmail(inputEmail) {
  return /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(
    inputEmail
  );
}

function isdni(inputdni) {
  return /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(inputdni);
}

function isLetters(inputLetters) {
  return /^[a-zA-Z\s]+$/.test(inputLetters);
}

function alertError() {
  const Toast = Swal.mixin({
    toast: true,
    background: "#f7e6ba",
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
  Toast.fire({
    icon: "error",
    title: "Por favor, verifique los datos ingresados",
  });
}
