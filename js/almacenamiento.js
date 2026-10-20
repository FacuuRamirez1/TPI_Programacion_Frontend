(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var CLAVES = {
    esquema: 'tuco:esquema',
    editoriales: 'tuco:editoriales',
    generos: 'tuco:generos',
    autores: 'tuco:autores',
    libros: 'tuco:libros',
    clientes: 'tuco:clientes',
    ventas: 'tuco:ventas'
  };

  function esColeccionConocida(nombre) {
    return Object.prototype.hasOwnProperty.call(CLAVES, nombre);
  }

  function obtenerAlmacen() {
    try {
      return global.localStorage || null;
    } catch (error) {
      return null;
    }
  }

  function copiarSeed(nombre) {
    if (nombre === 'ventas') {
      return [];
    }

    var datos = TUCO.datosIniciales;
    if (!datos || !Object.prototype.hasOwnProperty.call(datos, nombre)) {
      return [];
    }

    return JSON.parse(JSON.stringify(datos[nombre]));
  }

  function leerColeccion(nombre) {
    if (!esColeccionConocida(nombre)) {
      console.warn('almacenamiento: colección desconocida "' + nombre + '".');
      return [];
    }

    if (nombre === 'esquema') {
      return [];
    }

    var almacen = obtenerAlmacen();
    if (!almacen) {
      console.warn('almacenamiento: localStorage no disponible; se usa el seed de "' + nombre + '".');
      return copiarSeed(nombre);
    }

    try {
      var guardado = almacen.getItem(CLAVES[nombre]);
      if (guardado === null) {
        var semilla = copiarSeed(nombre);
        escribirColeccion(nombre, semilla);
        return semilla;
      }

      var coleccion = JSON.parse(guardado);
      if (!Array.isArray(coleccion)) {
        throw new Error('El valor guardado no es un arreglo.');
      }
      return coleccion;
    } catch (error) {
      console.warn('almacenamiento: no se pudo leer "' + nombre + '"; se usa el seed.', error);
      var copia = copiarSeed(nombre);
      escribirColeccion(nombre, copia);
      return copia;
    }
  }

  function escribirColeccion(nombre, coleccion) {
    if (!esColeccionConocida(nombre) || nombre === 'esquema') {
      console.warn('almacenamiento: no se puede escribir la colección "' + nombre + '".');
      return;
    }

    var almacen = obtenerAlmacen();
    if (!almacen) {
      console.warn('almacenamiento: localStorage no disponible; no se guardó "' + nombre + '".');
      return;
    }

    try {
      almacen.setItem(CLAVES[nombre], JSON.stringify(coleccion));
    } catch (error) {
      console.warn('almacenamiento: no se pudo guardar "' + nombre + '".', error);
    }
  }

  function siguienteId(prefijo, coleccion) {
    var maximo = 0;
    var registros = Array.isArray(coleccion) ? coleccion : [];
    var prefijoConGuion = prefijo + '-';

    registros.forEach(function (registro) {
      if (!registro || typeof registro.id !== 'string') {
        return;
      }
      if (registro.id.indexOf(prefijoConGuion) !== 0) {
        return;
      }

      var numero = parseInt(registro.id.slice(prefijo.length + 1), 10);
      if (!isNaN(numero) && numero > maximo) {
        maximo = numero;
      }
    });

    return prefijo + '-' + (maximo + 1);
  }

  function obtenerPorId(nombre, id) {
    var encontrado = leerColeccion(nombre).find(function (registro) {
      return registro && registro.id === id;
    });

    return encontrado || null;
  }

  TUCO.almacenamiento = {
    CLAVES: CLAVES,
    leerColeccion: leerColeccion,
    escribirColeccion: escribirColeccion,
    siguienteId: siguienteId,
    obtenerPorId: obtenerPorId
  };
})(window);
