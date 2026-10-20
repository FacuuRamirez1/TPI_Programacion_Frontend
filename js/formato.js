(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var formateadorMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function formatearMoneda(valor) {
    return formateadorMoneda.format(Number(valor));
  }

  function formatearFecha(iso) {
    if (typeof iso !== 'string') {
      return '';
    }

    var parteFecha = iso.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(parteFecha)) {
      return '';
    }

    var partes = parteFecha.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  TUCO.formato = {
    formatearMoneda: formatearMoneda,
    formatearFecha: formatearFecha
  };
})(window);
