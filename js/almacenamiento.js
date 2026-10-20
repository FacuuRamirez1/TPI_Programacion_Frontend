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

  var MODO_MEMORIA = false;
  var memoriaCache = {};

  function esColeccionConocida(nombre) {
    return Object.prototype.hasOwnProperty.call(CLAVES, nombre) && nombre !== 'esquema';
  }

  function obtenerAlmacen() {
    if (MODO_MEMORIA) {
      return null;
    }
    try {
      return global.localStorage || null;
    } catch (error) {
      return null;
    }
  }

  function detectarModoMemoria() {
    try {
      var testKey = '__tuco_test__';
      global.localStorage.setItem(testKey, '1');
      global.localStorage.removeItem(testKey);
      MODO_MEMORIA = false;
    } catch (error) {
      MODO_MEMORIA = true;
      memoriaCache = {};
    }
  }

  function leerDeMemoria(clave) {
    if (Object.prototype.hasOwnProperty.call(memoriaCache, clave)) {
      return memoriaCache[clave];
    }
    return null;
  }

  function escribirEnMemoria(clave, valor) {
    memoriaCache[clave] = valor;
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

  function inicializarEsquema() {
    var almacen = obtenerAlmacen();
    var yaInicializado = false;

    if (almacen) {
      try {
        yaInicializado = almacen.getItem(CLAVES.esquema) === '1';
      } catch (error) {
        yaInicializado = false;
      }
    } else if (MODO_MEMORIA) {
      yaInicializado = memoriaCache[CLAVES.esquema] === '1';
    }

    if (yaInicializado) {
      return;
    }

    var colecciones = ['editoriales', 'generos', 'autores', 'libros', 'clientes', 'ventas'];
    colecciones.forEach(function (nombre) {
      var semilla = copiarSeed(nombre);
      if (almacen) {
        try {
          almacen.setItem(CLAVES[nombre], JSON.stringify(semilla));
        } catch (error) {
          console.warn('almacenamiento: no se pudo inicializar "' + nombre + '".', error);
        }
      } else if (MODO_MEMORIA) {
        escribirEnMemoria(CLAVES[nombre], semilla);
      }
    });

    if (almacen) {
      try {
        almacen.setItem(CLAVES.esquema, '1');
      } catch (error) {
        console.warn('almacenamiento: no se pudo guardar la versión de esquema.', error);
      }
    } else if (MODO_MEMORIA) {
      escribirEnMemoria(CLAVES.esquema, '1');
    }
  }

  function leerColeccion(nombre) {
    if (!esColeccionConocida(nombre)) {
      console.warn('almacenamiento: colección desconocida "' + nombre + '".');
      return [];
    }

    var almacen = obtenerAlmacen();
    var guardado = null;

    if (almacen) {
      try {
        guardado = almacen.getItem(CLAVES[nombre]);
      } catch (error) {
        console.warn('almacenamiento: error al leer "' + nombre + '".', error);
      }
    } else if (MODO_MEMORIA) {
      guardado = leerDeMemoria(CLAVES[nombre]);
    }

    if (guardado === null) {
      var esquemaExiste = false;
      if (almacen) {
        try {
          esquemaExiste = almacen.getItem(CLAVES.esquema) === '1';
        } catch (error) {
          esquemaExiste = false;
        }
      } else if (MODO_MEMORIA) {
        esquemaExiste = memoriaCache[CLAVES.esquema] === '1';
      }

      if (esquemaExiste) {
        var vacia = [];
        escribirColeccion(nombre, vacia);
        return vacia;
      }

      var semilla = copiarSeed(nombre);
      escribirColeccion(nombre, semilla);
      return semilla;
    }

    try {
      var coleccion = JSON.parse(guardado);
      if (!Array.isArray(coleccion)) {
        throw new Error('El valor guardado no es un arreglo.');
      }
      return coleccion;
    } catch (error) {
      console.warn('almacenamiento: JSON inválido en "' + nombre + '"; se usa el seed.', error);
      var copia = copiarSeed(nombre);
      escribirColeccion(nombre, copia);
      return copia;
    }
  }

  function leerColeccionSegura(nombre) {
    if (!esColeccionConocida(nombre)) {
      console.warn('almacenamiento: colección desconocida "' + nombre + '".');
      return [];
    }

    var almacen = obtenerAlmacen();
    var guardado = null;

    if (almacen) {
      try {
        guardado = almacen.getItem(CLAVES[nombre]);
      } catch (error) {
        console.warn('almacenamiento: error al leer "' + nombre + '".', error);
      }
    } else if (MODO_MEMORIA) {
      guardado = leerDeMemoria(CLAVES[nombre]);
    }

    if (guardado === null) {
      var esquemaExiste = false;
      if (almacen) {
        try {
          esquemaExiste = almacen.getItem(CLAVES.esquema) === '1';
        } catch (error) {
          esquemaExiste = false;
        }
      } else if (MODO_MEMORIA) {
        esquemaExiste = memoriaCache[CLAVES.esquema] === '1';
      }

      if (esquemaExiste) {
        return [];
      }

      return copiarSeed(nombre);
    }

    try {
      var coleccion = JSON.parse(guardado);
      if (!Array.isArray(coleccion)) {
        throw new Error('El valor guardado no es un arreglo.');
      }
      return coleccion;
    } catch (error) {
      console.warn('almacenamiento: JSON corrupto en "' + nombre + '".', error);
      if (typeof TUCO.mostrarMensaje === 'function') {
        TUCO.mostrarMensaje('error', 'Datos de ' + nombre + ' corruptos. ¿Reiniciar solo esta colección?', {
          accion: 'reiniciar',
          coleccion: nombre
        });
      }
      return [];
    }
  }

  function escribirColeccion(nombre, coleccion) {
    if (!esColeccionConocida(nombre)) {
      console.warn('almacenamiento: no se puede escribir la colección "' + nombre + '".');
      return;
    }

    var almacen = obtenerAlmacen();

    if (!almacen && !MODO_MEMORIA) {
      console.warn('almacenamiento: localStorage no disponible; no se guardó "' + nombre + '".');
      return;
    }

    try {
      var json = JSON.stringify(coleccion);
      if (almacen) {
        almacen.setItem(CLAVES[nombre], json);
      } else if (MODO_MEMORIA) {
        escribirEnMemoria(CLAVES[nombre], json);
      }
    } catch (error) {
      if (error && error.name === 'QuotaExceededError') {
        var errorCuota = new Error('CUOTA_AGOTADA');
        errorCuota.mensajeVisible = 'No hay espacio en el almacenamiento local. La operación no se guardó.';
        throw errorCuota;
      }
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

  function mostrarMensaje(tipo, texto, opciones) {
    var contenedor = global.document && global.document.getElementById('tuco-mensajes');
    if (!contenedor) {
      console.warn('almacenamiento: contenedor #tuco-mensajes no encontrado en el DOM.');
      return;
    }

    var clasesBase = 'mensaje';
    var claseTipo = 'mensaje--' + tipo;

    contenedor.className = clasesBase + ' ' + claseTipo;
    contenedor.textContent = texto;
    contenedor.hidden = false;
    contenedor.removeAttribute('aria-hidden');

    if (opciones && opciones.accion === 'reiniciar' && opciones.coleccion) {
      var boton = global.document.createElement('button');
      boton.type = 'button';
      boton.className = 'boton boton--secundario boton--pequeno';
      boton.style.marginLeft = 'var(--espacio-3)';
      boton.textContent = 'Reiniciar';
      boton.addEventListener('click', function () {
        var vacia = [];
        escribirColeccion(opciones.coleccion, vacia);
        ocultarMensaje();
        global.location.reload();
      });
      contenedor.appendChild(global.document.createTextNode(' '));
      contenedor.appendChild(boton);
    }
  }

  function ocultarMensaje() {
    var contenedor = global.document && global.document.getElementById('tuco-mensajes');
    if (!contenedor) {
      return;
    }
    contenedor.hidden = true;
    contenedor.textContent = '';
    contenedor.className = 'visualmente-oculto';
  }

  detectarModoMemoria();

  inicializarEsquema();

  if (MODO_MEMORIA && typeof TUCO.mostrarMensaje === 'function') {
    TUCO.mostrarMensaje('aviso', 'El almacenamiento local no está disponible. Los datos no se guardarán al recargar.');
  }

  TUCO.almacenamiento = {
    CLAVES: CLAVES,
    leerColeccion: leerColeccion,
    escribirColeccion: escribirColeccion,
    siguienteId: siguienteId,
    obtenerPorId: obtenerPorId,
    inicializarEsquema: inicializarEsquema,
    leerColeccionSegura: leerColeccionSegura
  };

  TUCO.mostrarMensaje = mostrarMensaje;
  TUCO.ocultarMensaje = ocultarMensaje;

})(window);