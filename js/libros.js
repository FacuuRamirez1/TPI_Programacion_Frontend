(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var CAMPOS = ['titulo', 'isbn', 'precio', 'editorialId', 'generoId', 'autorIds'];

  var elementos = null;
  var inicializado = false;

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

  function construirIndices() {
    function crearIndice(nombre) {
      var indice = new Map();
      TUCO.almacenamiento.leerColeccion(nombre).forEach(function (entidad) {
        if (entidad && entidad.id) {
          indice.set(entidad.id, entidad);
        }
      });
      return indice;
    }

    return {
      editoriales: crearIndice('editoriales'),
      generos: crearIndice('generos'),
      autores: crearIndice('autores')
    };
  }

  function poblarSelectores() {
    var editoriales = TUCO.almacenamiento.leerColeccion('editoriales');
    var generos = TUCO.almacenamiento.leerColeccion('generos');
    var autores = TUCO.almacenamiento.leerColeccion('autores');

    var opcionesEditorial = document.createDocumentFragment();
    opcionesEditorial.appendChild(crearOpcion('', 'Seleccioná una editorial', true, true));
    editoriales.forEach(function (editorial) {
      opcionesEditorial.appendChild(crearOpcion(editorial.id, editorial.nombre, false, false));
    });
    elementos.editorial.replaceChildren(opcionesEditorial);

    var opcionesGenero = document.createDocumentFragment();
    opcionesGenero.appendChild(crearOpcion('', 'Sin clasificar', false, true));
    generos.forEach(function (genero) {
      opcionesGenero.appendChild(crearOpcion(genero.id, genero.nombre, false, false));
    });
    elementos.genero.replaceChildren(opcionesGenero);

    var opcionesAutor = document.createDocumentFragment();
    opcionesAutor.appendChild(crearOpcion('', 'Seleccioná uno o más autores', true, false));
    autores.forEach(function (autor) {
      opcionesAutor.appendChild(crearOpcion(autor.id, autor.nombre + ' ' + autor.apellido, false, false));
    });
    elementos.autores.replaceChildren(opcionesAutor);
  }

  function crearFilaLibro(libro, indices) {
    var fragmento = elementos.plantilla.content.cloneNode(true);
    var celdas = fragmento.querySelectorAll('td');

    var editorial = indices.editoriales.get(libro.editorialId);
    var genero = libro.generoId === null || libro.generoId === undefined
      ? null
      : indices.generos.get(libro.generoId);
    var autores = (Array.isArray(libro.autorIds) ? libro.autorIds : [])
      .map(function (autorId) {
        var autor = indices.autores.get(autorId);
        return autor ? autor.nombre + ' ' + autor.apellido : '';
      })
      .filter(Boolean)
      .join(', ');

    celdas[0].textContent = libro.titulo;
    celdas[1].textContent = libro.isbn;
    celdas[2].textContent = editorial ? editorial.nombre : '';
    celdas[3].textContent = genero ? genero.nombre : 'Sin clasificar';
    celdas[4].textContent = autores;
    celdas[5].textContent = TUCO.formato.formatearMoneda(libro.precio);

    return fragmento;
  }

  function renderizarListado() {
    var libros = TUCO.almacenamiento.leerColeccion('libros');
    var indices = construirIndices();
    var fragmento = document.createDocumentFragment();

    libros.forEach(function (libro) {
      fragmento.appendChild(crearFilaLibro(libro, indices));
    });

    elementos.cuerpo.replaceChildren(fragmento);
    elementos.vacio.hidden = libros.length > 0;
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
    elementos.mensaje.textContent = 'Libro registrado correctamente.';
    elementos.mensaje.classList.add('mensaje--exito');
    elementos.mensaje.hidden = false;
  }

  function leerEntrada() {
    return {
      titulo: elementos.titulo.value,
      isbn: elementos.isbn.value,
      precio: elementos.precio.value,
      editorialId: elementos.editorial.value,
      generoId: elementos.genero.value,
      autorIds: Array.from(elementos.autores.selectedOptions).map(function (opcion) {
        return opcion.value;
      })
    };
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    ocultarExito();
    limpiarErrores();

    var entrada = leerEntrada();
    var contexto = {
      libros: TUCO.almacenamiento.leerColeccion('libros'),
      editoriales: TUCO.almacenamiento.leerColeccion('editoriales'),
      generos: TUCO.almacenamiento.leerColeccion('generos'),
      autores: TUCO.almacenamiento.leerColeccion('autores')
    };

    var resultado = TUCO.validaciones.validarLibro(entrada, contexto);

    if (!resultado.valido) {
      mostrarErrores(resultado.errores);
      return;
    }

    var libros = TUCO.almacenamiento.leerColeccion('libros');
    var registro = {
      id: TUCO.almacenamiento.siguienteId('lib', libros),
      titulo: resultado.datos.titulo,
      isbn: resultado.datos.isbn,
      precio: resultado.datos.precio,
      editorialId: resultado.datos.editorialId,
      generoId: resultado.datos.generoId,
      autorIds: resultado.datos.autorIds
    };

    TUCO.almacenamiento.escribirColeccion('libros', libros.concat(registro));
    renderizarListado();
    elementos.formulario.reset();
    mostrarExito();
    elementos.titulo.focus();
  }

  function inicializar() {
    if (inicializado) {
      return;
    }

    var formulario = document.getElementById('form-libro');
    var plantilla = document.getElementById('plantilla-fila-libro');
    var cuerpo = document.querySelector('#tabla-libros tbody');
    var vacio = document.getElementById('mensaje-libros-vacio');

    if (!formulario || !plantilla || !cuerpo || !vacio) {
      return;
    }

    elementos = {
      formulario: formulario,
      titulo: document.getElementById('titulo'),
      isbn: document.getElementById('isbn'),
      precio: document.getElementById('precio'),
      editorial: document.getElementById('editorialId'),
      genero: document.getElementById('generoId'),
      autores: document.getElementById('autorIds'),
      resumen: document.getElementById('resumen-errores-libro'),
      cuerpo: cuerpo,
      plantilla: plantilla,
      vacio: vacio,
      mensaje: document.getElementById('mensaje-libro'),
      controles: {
        titulo: document.getElementById('titulo'),
        isbn: document.getElementById('isbn'),
        precio: document.getElementById('precio'),
        editorialId: document.getElementById('editorialId'),
        generoId: document.getElementById('generoId'),
        autorIds: document.getElementById('autorIds')
      },
      errores: {
        titulo: document.getElementById('error-titulo'),
        isbn: document.getElementById('error-isbn'),
        precio: document.getElementById('error-precio'),
        editorialId: document.getElementById('error-editorialId'),
        generoId: document.getElementById('error-generoId'),
        autorIds: document.getElementById('error-autorIds')
      }
    };

    poblarSelectores();
    renderizarListado();
    formulario.addEventListener('submit', manejarEnvio);
    inicializado = true;
  }

  TUCO.libros = {
    inicializar: inicializar,
    poblarSelectores: poblarSelectores,
    renderizarListado: renderizarListado
  };

  if (typeof document !== 'undefined') {
    TUCO.libros.inicializar();
  }
})(window);
