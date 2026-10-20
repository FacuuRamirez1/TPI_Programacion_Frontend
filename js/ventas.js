(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var CAMPOS = ['clienteId', 'libroId', 'cantidad'];

  var elementos = null;
  var renglones = [];
  var inicializado = false;
  var confirmando = false;

  function redondear2(valor) {
    return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
  }

  function crearOpcion(valor, texto, deshabilitada, seleccionada) {
    var opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    opcion.disabled = Boolean(deshabilitada);
    if (seleccionada) {
      opcion.setAttribute('selected', '');
    }
    return opcion;
  }

  function poblarSelectores() {
    var clientes = TUCO.almacenamiento.leerColeccion('clientes');
    var libros = TUCO.almacenamiento.leerColeccion('libros');

    var opcionesCliente = document.createDocumentFragment();
    opcionesCliente.appendChild(crearOpcion('', 'Seleccioná un cliente', true, true));
    clientes.forEach(function (cliente) {
      opcionesCliente.appendChild(crearOpcion(cliente.id, cliente.nombreCompleto, false, false));
    });
    elementos.clienteId.replaceChildren(opcionesCliente);

    var opcionesLibro = document.createDocumentFragment();
    opcionesLibro.appendChild(crearOpcion('', 'Seleccioná un libro', true, true));
    libros.forEach(function (libro) {
      opcionesLibro.appendChild(crearOpcion(
        libro.id,
        libro.titulo + ' — ' + TUCO.formato.formatearMoneda(libro.precio),
        false,
        false
      ));
    });
    elementos.libroId.replaceChildren(opcionesLibro);
  }

  function indiceLibros() {
    var indice = new Map();
    TUCO.almacenamiento.leerColeccion('libros').forEach(function (libro) {
      if (libro && typeof libro.id === 'string') {
        indice.set(libro.id, libro);
      }
    });
    return indice;
  }

  function calcularSubtotal(renglon, libro) {
    return redondear2(Number(renglon.cantidad) * Number(libro.precio));
  }

  function calcularTotal() {
    var indice = indiceLibros();
    var total = 0;

    renglones.forEach(function (renglon) {
      var libro = indice.get(renglon.libroId);
      if (!libro) {
        return;
      }
      total += calcularSubtotal(renglon, libro);
    });

    return redondear2(total);
  }

  function crearFilaRenglon(renglon, libro) {
    var fragmento = elementos.plantilla.content.cloneNode(true);
    var fila = fragmento.querySelector('tr');
    var celdas = fila.querySelectorAll('td');
    var input = fila.querySelector('.cantidad-renglon');
    var boton = fila.querySelector('button[data-accion="quitar"]');

    fila.dataset.libroId = renglon.libroId;
    celdas[0].textContent = libro.titulo;
    input.value = String(renglon.cantidad);
    input.setAttribute('aria-label', 'Cantidad de ' + libro.titulo);
    input.setAttribute('aria-describedby', 'mensaje-venta');
    celdas[2].textContent = TUCO.formato.formatearMoneda(libro.precio);
    celdas[3].textContent = TUCO.formato.formatearMoneda(calcularSubtotal(renglon, libro));
    boton.setAttribute('aria-label', 'Quitar renglón de ' + libro.titulo);

    return fragmento;
  }

  function renderizarRenglones() {
    var indice = indiceLibros();
    var fragmento = document.createDocumentFragment();

    renglones.forEach(function (renglon) {
      var libro = indice.get(renglon.libroId);
      if (!libro) {
        return;
      }
      fragmento.appendChild(crearFilaRenglon(renglon, libro));
    });

    elementos.cuerpo.replaceChildren(fragmento);
    actualizarTotal();
  }

  function actualizarTotal() {
    elementos.total.textContent = TUCO.formato.formatearMoneda(calcularTotal());
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

  function ocultarMensaje() {
    elementos.mensaje.textContent = '';
    elementos.mensaje.hidden = true;
    elementos.mensaje.classList.remove('mensaje--info', 'mensaje--exito', 'mensaje--error');
  }

  function mostrarMensaje(texto, variante) {
    elementos.mensaje.classList.remove('mensaje--info', 'mensaje--exito', 'mensaje--error');
    elementos.mensaje.classList.add('mensaje--' + (variante || 'info'));
    elementos.mensaje.textContent = texto;
    elementos.mensaje.hidden = false;
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

    var resumen = '';
    if (etiquetas.length > 0) {
      resumen = 'Revisá los siguientes campos: ' + etiquetas.join(', ') + '.';
    }

    if (Object.prototype.hasOwnProperty.call(errores, 'renglones')) {
      resumen = resumen === '' ? errores.renglones : resumen + ' ' + errores.renglones;
      mostrarMensaje(errores.renglones, 'error');
    }

    elementos.resumen.textContent = resumen;
    elementos.resumen.hidden = resumen === '';

    var primerCampo = CAMPOS.find(function (campo) {
      return Object.prototype.hasOwnProperty.call(errores, campo);
    });

    if (primerCampo) {
      elementos.controles[primerCampo].focus();
    } else if (Object.prototype.hasOwnProperty.call(errores, 'renglones')) {
      elementos.libroId.focus();
    }
  }

  function manejarAltaRenglon(evento) {
    evento.preventDefault();
    limpiarErrores();
    ocultarMensaje();

    var entrada = {
      libroId: elementos.libroId.value,
      cantidad: elementos.cantidad.value
    };
    var resultado = TUCO.validaciones.validarRenglon(entrada, {
      libros: TUCO.almacenamiento.leerColeccion('libros'),
      renglones: renglones
    });

    if (!resultado.valido) {
      mostrarErrores(resultado.errores);
      return;
    }

    renglones.push({
      libroId: resultado.datos.libroId,
      cantidad: resultado.datos.cantidad
    });
    elementos.libroId.value = '';
    elementos.cantidad.value = '';
    renderizarRenglones();
    mostrarMensaje('Renglón agregado.', 'info');
    elementos.libroId.focus();
  }

  function buscarInputDeLibro(libroId) {
    return elementos.cuerpo.querySelector('tr[data-libro-id="' + libroId + '"] .cantidad-renglon');
  }

  function manejarCambioCantidad(evento) {
    var input = evento.target;
    if (!input || !input.classList || !input.classList.contains('cantidad-renglon')) {
      return;
    }

    var fila = input.closest('tr');
    if (!fila) {
      return;
    }

    var libroId = fila.dataset.libroId;
    var indice = renglones.findIndex(function (renglon) {
      return renglon.libroId === libroId;
    });

    if (indice === -1) {
      return;
    }

    var resultado = TUCO.validaciones.validarCantidad(input.value);

    if (!resultado.valido) {
      input.value = String(renglones[indice].cantidad);
      input.setAttribute('aria-invalid', 'true');
      ocultarMensaje();
      mostrarMensaje(resultado.error, 'error');
      input.focus();
      return;
    }

    renglones[indice].cantidad = Number(String(input.value).trim());
    input.removeAttribute('aria-invalid');
    renderizarRenglones();
    mostrarMensaje('Cantidad actualizada.', 'info');

    var nuevoInput = buscarInputDeLibro(libroId);
    if (nuevoInput) {
      nuevoInput.focus();
    }
  }

  function manejarEntradaCantidad(evento) {
    var input = evento.target;
    if (!input || !input.classList || !input.classList.contains('cantidad-renglon')) {
      return;
    }

    input.removeAttribute('aria-invalid');
    if (elementos.mensaje.classList.contains('mensaje--error')) {
      ocultarMensaje();
    }
  }

  function manejarClicRenglones(evento) {
    var boton = evento.target.closest('button[data-accion="quitar"]');
    if (!boton) {
      return;
    }

    var fila = boton.closest('tr');
    if (!fila) {
      return;
    }

    var libroId = fila.dataset.libroId;
    renglones = renglones.filter(function (renglon) {
      return renglon.libroId !== libroId;
    });
    renderizarRenglones();

    if (renglones.length === 0) {
      mostrarMensaje('Todavía no se agregaron renglones a la venta.', 'info');
    } else {
      mostrarMensaje('Renglón quitado.', 'info');
    }
  }

  function manejarConfirmacion() {
    if (confirmando) {
      return;
    }

    limpiarErrores();
    ocultarMensaje();

    var resultado = TUCO.validaciones.validarVenta(
      {
        clienteId: elementos.clienteId.value,
        renglones: renglones
      },
      {
        clientes: TUCO.almacenamiento.leerColeccion('clientes'),
        libros: TUCO.almacenamiento.leerColeccion('libros')
      }
    );

    if (!resultado.valido) {
      mostrarErrores(resultado.errores);
      return;
    }

    confirmando = true;
    elementos.botonConfirmar.disabled = true;
    elementos.botonConfirmar.setAttribute('aria-busy', 'true');

    try {
      var ventas = TUCO.almacenamiento.leerColeccion('ventas');
      var id = TUCO.almacenamiento.siguienteId('ven', ventas);
      var venta = {
        id: id,
        fecha: new Date().toISOString(),
        clienteId: resultado.datos.clienteId,
        clienteNombre: resultado.datos.clienteNombre,
        renglones: resultado.datos.renglones,
        total: resultado.datos.total
      };

      TUCO.almacenamiento.escribirColeccion('ventas', ventas.concat(venta));

      var verificada = TUCO.almacenamiento.leerColeccion('ventas').find(function (registro) {
        return registro && registro.id === id;
      });

      if (!verificada) {
        mostrarMensaje('No se pudo confirmar la venta. Revisá el almacenamiento e intentá de nuevo.', 'error');
        return;
      }

      renglones = [];
      elementos.formulario.reset();
      renderizarRenglones();
      mostrarMensaje(
        'Venta ' + id + ' confirmada por ' + TUCO.formato.formatearMoneda(verificada.total) + '.',
        'exito'
      );
      elementos.clienteId.focus();
    } finally {
      confirmando = false;
      elementos.botonConfirmar.disabled = false;
      elementos.botonConfirmar.removeAttribute('aria-busy');
    }
  }

  function inicializar() {
    if (inicializado) {
      return;
    }

    var formulario = document.getElementById('form-venta');
    var cuerpo = document.querySelector('#tabla-renglones tbody');
    var plantilla = document.getElementById('plantilla-fila-renglon');
    var botonConfirmar = document.getElementById('boton-confirmar');

    if (!formulario || !cuerpo || !plantilla || !botonConfirmar) {
      return;
    }

    elementos = {
      formulario: formulario,
      clienteId: document.getElementById('clienteId'),
      libroId: document.getElementById('libroId'),
      cantidad: document.getElementById('cantidad'),
      resumen: document.getElementById('resumen-errores-venta'),
      cuerpo: cuerpo,
      plantilla: plantilla,
      total: document.getElementById('total-venta'),
      mensaje: document.getElementById('mensaje-venta'),
      botonConfirmar: botonConfirmar,
      controles: {
        clienteId: document.getElementById('clienteId'),
        libroId: document.getElementById('libroId'),
        cantidad: document.getElementById('cantidad')
      },
      errores: {
        clienteId: document.getElementById('error-clienteId'),
        libroId: document.getElementById('error-libroId'),
        cantidad: document.getElementById('error-cantidad')
      }
    };

    poblarSelectores();
    renderizarRenglones();

    formulario.addEventListener('submit', manejarAltaRenglon);
    cuerpo.addEventListener('change', manejarCambioCantidad);
    cuerpo.addEventListener('input', manejarEntradaCantidad);
    cuerpo.addEventListener('click', manejarClicRenglones);
    botonConfirmar.addEventListener('click', manejarConfirmacion);

    inicializado = true;
  }

  TUCO.ventas = {
    inicializar: inicializar
  };

  if (typeof document !== 'undefined') {
    TUCO.ventas.inicializar();
  }
})(window);
