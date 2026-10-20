(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var elementos = null;
  var inicializado = false;

  function numeroDeVenta(id) {
    var texto = String(id ?? '');
    if (texto.indexOf('ven-') !== 0) {
      return 0;
    }

    var numero = parseInt(texto.slice(4), 10);
    return isNaN(numero) ? 0 : numero;
  }

  function crearFilaVenta(venta) {
    var fragmento = elementos.plantilla.content.cloneNode(true);
    var celdas = fragmento.querySelectorAll('td');
    var id = String(venta.id ?? '');
    var enlace = celdas[4].querySelector('a');
    var oculto = enlace.querySelector('.visualmente-oculto');

    celdas[0].textContent = id;
    celdas[1].textContent = TUCO.formato.formatearFecha(venta.fecha);
    celdas[2].textContent = String(venta.clienteNombre ?? '');
    celdas[3].textContent = TUCO.formato.formatearMoneda(venta.total);
    enlace.setAttribute('href', 'venta-detalle.html?id=' + encodeURIComponent(id));

    if (oculto) {
      oculto.textContent = ' de la venta ' + id;
    }

    return fragmento;
  }

  function renderizarHistorial() {
    if (!elementos) {
      return;
    }

    var ventas = TUCO.almacenamiento.leerColeccion('ventas');
    var ordenadas = ventas.slice().sort(function (a, b) {
      return numeroDeVenta(b && b.id) - numeroDeVenta(a && a.id);
    });

    var fragmento = document.createDocumentFragment();
    ordenadas.forEach(function (venta) {
      if (venta) {
        fragmento.appendChild(crearFilaVenta(venta));
      }
    });

    elementos.cuerpo.replaceChildren(fragmento);
    elementos.vacio.hidden = ordenadas.length > 0;
  }

  function inicializar() {
    if (inicializado) {
      return;
    }

    var cuerpo = document.querySelector('#tabla-ventas tbody');
    var plantilla = document.getElementById('plantilla-fila-venta');
    var vacio = document.getElementById('mensaje-historial-vacio');

    if (!cuerpo || !plantilla || !vacio) {
      return;
    }

    elementos = {
      cuerpo: cuerpo,
      plantilla: plantilla,
      vacio: vacio
    };

    renderizarHistorial();
    inicializado = true;
  }

  TUCO.historial = {
    inicializar: inicializar,
    renderizarHistorial: renderizarHistorial
  };

  if (typeof document !== 'undefined') {
    TUCO.historial.inicializar();
  }
})(window);
