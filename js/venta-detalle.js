(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var elementos = null;
  var inicializado = false;

  function obtenerId() {
    try {
      var parametros = new URLSearchParams(global.location.search);
      return String(parametros.get('id') ?? '').trim();
    } catch (error) {
      return '';
    }
  }

  function mostrarError() {
    elementos.detalle.replaceChildren();
    elementos.mensaje.hidden = false;
  }

  function crearPar(termino, valor) {
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = termino;
    dd.textContent = valor;
    return { dt: dt, dd: dd };
  }

  function crearResumen(venta) {
    var dl = document.createElement('dl');
    var pares = [
      crearPar('Identificador', String(venta.id ?? '')),
      crearPar('Fecha', TUCO.formato.formatearFecha(venta.fecha)),
      crearPar('Cliente', String(venta.clienteNombre ?? '')),
      crearPar('Total', TUCO.formato.formatearMoneda(venta.total))
    ];

    pares.forEach(function (par) {
      dl.appendChild(par.dt);
      dl.appendChild(par.dd);
    });

    return dl;
  }

  function crearTablaRenglones(venta) {
    var id = String(venta.id ?? '');
    var contenedor = document.createElement('div');
    var tabla = document.createElement('table');
    var caption = document.createElement('caption');
    var thead = document.createElement('thead');
    var filaEncabezados = document.createElement('tr');
    var tbody = document.createElement('tbody');

    contenedor.className = 'tabla-contenedor';
    contenedor.setAttribute('role', 'region');
    contenedor.setAttribute('tabindex', '0');
    contenedor.setAttribute('aria-label', 'Renglones de la venta ' + id + ', tabla desplazable');

    tabla.className = 'tabla tabla--ancha';
    caption.textContent = 'Renglones de la venta ' + id;

    ['Libro', 'Cantidad', 'Precio unitario', 'Subtotal'].forEach(function (texto) {
      var th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = texto;
      filaEncabezados.appendChild(th);
    });

    thead.appendChild(filaEncabezados);

    venta.renglones.forEach(function (renglon) {
      var fila = document.createElement('tr');
      var celdas = [
        String((renglon && renglon.titulo) ?? ''),
        String((renglon && renglon.cantidad) ?? ''),
        TUCO.formato.formatearMoneda(renglon && renglon.precioUnitario),
        TUCO.formato.formatearMoneda(renglon && renglon.subtotal)
      ];

      celdas.forEach(function (texto) {
        var td = document.createElement('td');
        td.textContent = texto;
        fila.appendChild(td);
      });

      tbody.appendChild(fila);
    });

    tabla.appendChild(caption);
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);

    return contenedor;
  }

  function renderizar(venta) {
    var fragmento = document.createDocumentFragment();
    fragmento.appendChild(crearResumen(venta));
    fragmento.appendChild(crearTablaRenglones(venta));
    elementos.detalle.replaceChildren(fragmento);
    elementos.mensaje.hidden = true;
  }

  function inicializar() {
    if (inicializado) {
      return;
    }

    var detalle = document.getElementById('detalle-venta');
    var mensaje = document.getElementById('mensaje-detalle');

    if (!detalle || !mensaje) {
      return;
    }

    elementos = {
      detalle: detalle,
      mensaje: mensaje
    };

    var id = obtenerId();
    if (!/^ven-\d+$/.test(id)) {
      mostrarError();
      inicializado = true;
      return;
    }

    var venta = TUCO.almacenamiento.obtenerPorId('ventas', id);
    if (!venta || !Array.isArray(venta.renglones)) {
      mostrarError();
      inicializado = true;
      return;
    }

    renderizar(venta);
    inicializado = true;
  }

  TUCO.ventaDetalle = {
    inicializar: inicializar
  };

  if (typeof document !== 'undefined') {
    TUCO.ventaDetalle.inicializar();
  }
})(window);
