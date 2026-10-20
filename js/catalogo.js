(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var elementos = null;

  function normalizarTexto(texto) {
    return String(texto ?? '').trim().toLowerCase();
  }

  function filtrarPorTitulo(libros, consulta) {
    var lista = Array.isArray(libros) ? libros : [];
    var consultaNormalizada = normalizarTexto(consulta);

    if (consultaNormalizada === '') {
      return lista.slice();
    }

    return lista.filter(function (libro) {
      return normalizarTexto(libro && libro.titulo).includes(consultaNormalizada);
    });
  }

  function crearIndice(nombre) {
    var indice = new Map();
    TUCO.almacenamiento.leerColeccion(nombre).forEach(function (entidad) {
      if (entidad && entidad.id) {
        indice.set(entidad.id, entidad);
      }
    });
    return indice;
  }

  function construirIndices() {
    return {
      editoriales: crearIndice('editoriales'),
      generos: crearIndice('generos'),
      autores: crearIndice('autores')
    };
  }

  function asignarTexto(contenedor, selector, valor) {
    var nodo = contenedor.querySelector(selector);
    if (nodo) {
      nodo.textContent = valor === null || valor === undefined ? '' : String(valor);
    }
  }

  function resolverAutores(autorIds, indices) {
    var ids = Array.isArray(autorIds) ? autorIds : [];

    return ids
      .map(function (autorId) {
        var autor = indices.autores.get(autorId);
        return autor ? autor.nombre + ' ' + autor.apellido : '';
      })
      .filter(Boolean)
      .join(', ');
  }

  function crearTarjeta(libro, indices) {
    var fragmento = elementos.plantilla.content.cloneNode(true);
    var tarjeta = fragmento.querySelector('.tarjeta');

    var editorial = indices.editoriales.get(libro.editorialId);
    var genero = libro.generoId === null || libro.generoId === undefined
      ? null
      : indices.generos.get(libro.generoId);

    asignarTexto(tarjeta, '.tarjeta-titulo', libro.titulo);
    asignarTexto(tarjeta, '.tarjeta-isbn', libro.isbn);
    asignarTexto(tarjeta, '.tarjeta-editorial', editorial ? editorial.nombre : '');
    asignarTexto(tarjeta, '.tarjeta-genero', genero ? genero.nombre : 'Sin clasificar');
    asignarTexto(tarjeta, '.tarjeta-autores', resolverAutores(libro.autorIds, indices));
    asignarTexto(tarjeta, '.tarjeta-precio', TUCO.formato.formatearMoneda(libro.precio));

    return tarjeta || fragmento;
  }

  function renderizar(libros, indices) {
    var fragmento = document.createDocumentFragment();

    libros.forEach(function (libro) {
      fragmento.appendChild(crearTarjeta(libro, indices));
    });

    elementos.listado.replaceChildren(fragmento);
  }

  function actualizarMensajes(libros, visibles) {
    if (!elementos.vacio || !elementos.sinResultados) {
      return;
    }

    if (libros.length === 0) {
      elementos.vacio.hidden = false;
      elementos.sinResultados.hidden = true;
      return;
    }

    if (visibles.length === 0) {
      elementos.vacio.hidden = true;
      elementos.sinResultados.hidden = false;
      return;
    }

    elementos.vacio.hidden = true;
    elementos.sinResultados.hidden = true;
  }

  function render(consulta) {
    var libros = TUCO.almacenamiento.leerColeccion('libros');
    var indices = construirIndices();
    var visibles = filtrarPorTitulo(libros, consulta);

    renderizar(visibles, indices);
    actualizarMensajes(libros, visibles);
  }

  function inicializar() {
    var listado = document.getElementById('listado-catalogo');
    var plantilla = document.getElementById('plantilla-tarjeta-libro');
    if (!listado || !plantilla) {
      return;
    }

    var buscador = document.getElementById('buscador-titulo');
    var formulario = buscador ? buscador.closest('form') : null;

    elementos = {
      buscador: buscador,
      listado: listado,
      vacio: document.getElementById('mensaje-catalogo-vacio'),
      sinResultados: document.getElementById('mensaje-sin-resultados'),
      plantilla: plantilla
    };

    render(buscador ? buscador.value : '');

    if (buscador) {
      buscador.addEventListener('input', function (evento) {
        render(evento.target.value);
      });
    }

    if (formulario) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
      });
    }
  }

  TUCO.catalogo = {
    inicializar: inicializar,
    normalizarTexto: normalizarTexto,
    filtrarPorTitulo: filtrarPorTitulo
  };

  if (typeof document !== 'undefined') {
    TUCO.catalogo.inicializar();
  }
})(window);
