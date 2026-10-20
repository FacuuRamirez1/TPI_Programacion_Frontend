(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var CAMPOS = ['nombreCompleto', 'email'];

  var elementos = null;
  var inicializado = false;

  function crearFilaCliente(cliente) {
    var fragmento = elementos.plantilla.content.cloneNode(true);
    var celdas = fragmento.querySelectorAll('td');

    celdas[0].textContent = cliente.nombreCompleto;
    celdas[1].textContent = cliente.email;

    return fragmento;
  }

  function renderizarListado() {
    var clientes = TUCO.almacenamiento.leerColeccion('clientes');
    var fragmento = document.createDocumentFragment();

    clientes.forEach(function (cliente) {
      fragmento.appendChild(crearFilaCliente(cliente));
    });

    elementos.cuerpo.replaceChildren(fragmento);
    elementos.vacio.hidden = clientes.length > 0;
  }

  function limpiarErrores() {
    CAMPOS.forEach(function (campo) {
      elementos.controles[campo].removeAttribute('aria-invalid');
      elementos.errores[campo].textContent = '';
      elementos.errores[campo].hidden = true;
    });

    elementos.resumen.textContent = '';
    elementos.resumen.hidden = true;
  }

  function etiquetaDeCampo(campo) {
    var etiqueta = document.querySelector('label[for="' + campo + '"]');
    return etiqueta ? etiqueta.textContent.trim() : campo;
  }

  function mostrarErrores(errores) {
    var etiquetas = [];

    CAMPOS.forEach(function (campo) {
      if (!Object.prototype.hasOwnProperty.call(errores, campo)) {
        return;
      }

      elementos.controles[campo].setAttribute('aria-invalid', 'true');
      elementos.errores[campo].textContent = errores[campo];
      elementos.errores[campo].hidden = false;
      etiquetas.push(etiquetaDeCampo(campo));
    });

    elementos.resumen.textContent = 'Revisá los siguientes campos: ' + etiquetas.join(', ') + '.';
    elementos.resumen.hidden = etiquetas.length === 0;

    var primerCampo = CAMPOS.find(function (campo) {
      return Object.prototype.hasOwnProperty.call(errores, campo);
    });

    if (primerCampo) {
      elementos.controles[primerCampo].focus();
    }
  }

  function ocultarExito() {
    elementos.mensaje.hidden = true;
    elementos.mensaje.textContent = '';
    elementos.mensaje.classList.remove('mensaje--exito');
  }

  function mostrarExito() {
    elementos.mensaje.textContent = 'Cliente registrado correctamente.';
    elementos.mensaje.classList.add('mensaje--exito');
    elementos.mensaje.hidden = false;
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    ocultarExito();
    limpiarErrores();

    var entrada = {
      nombreCompleto: elementos.nombreCompleto.value,
      email: elementos.email.value
    };
    var contexto = {
      clientes: TUCO.almacenamiento.leerColeccion('clientes')
    };

    var resultado = TUCO.validaciones.validarCliente(entrada, contexto);

    if (!resultado.valido) {
      mostrarErrores(resultado.errores);
      return;
    }

    var clientes = TUCO.almacenamiento.leerColeccion('clientes');
    var registro = {
      id: TUCO.almacenamiento.siguienteId('cli', clientes),
      nombreCompleto: resultado.datos.nombreCompleto,
      email: resultado.datos.email
    };

    TUCO.almacenamiento.escribirColeccion('clientes', clientes.concat(registro));
    renderizarListado();
    elementos.formulario.reset();
    mostrarExito();
    elementos.nombreCompleto.focus();
  }

  function inicializar() {
    if (inicializado) {
      return;
    }

    var formulario = document.getElementById('form-cliente');
    var plantilla = document.getElementById('plantilla-fila-cliente');
    var cuerpo = document.querySelector('#tabla-clientes tbody');
    var vacio = document.getElementById('mensaje-clientes-vacio');

    if (!formulario || !plantilla || !cuerpo || !vacio) {
      return;
    }

    elementos = {
      formulario: formulario,
      nombreCompleto: document.getElementById('nombreCompleto'),
      email: document.getElementById('email'),
      resumen: document.getElementById('resumen-errores-cliente'),
      cuerpo: cuerpo,
      plantilla: plantilla,
      vacio: vacio,
      mensaje: document.getElementById('mensaje-cliente'),
      controles: {
        nombreCompleto: document.getElementById('nombreCompleto'),
        email: document.getElementById('email')
      },
      errores: {
        nombreCompleto: document.getElementById('error-nombreCompleto'),
        email: document.getElementById('error-email')
      }
    };

    renderizarListado();
    formulario.addEventListener('submit', manejarEnvio);
    inicializado = true;
  }

  TUCO.clientes = {
    inicializar: inicializar,
    renderizarListado: renderizarListado
  };

  if (typeof document !== 'undefined') {
    TUCO.clientes.inicializar();
  }
})(window);
