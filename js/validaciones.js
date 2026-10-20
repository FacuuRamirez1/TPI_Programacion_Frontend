(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  var MENSAJES = {
    titulo: 'El título es obligatorio.',
    isbn: 'El ISBN es obligatorio.',
    isbnDuplicado: 'El ISBN ya existe',
    precio: 'El precio debe ser un número mayor que cero.',
    editorialId: 'Seleccioná una editorial existente.',
    generoId: 'El género seleccionado no existe.',
    autorIds: 'Seleccioná al menos un autor.',
    autorIdsInexistente: 'Uno o más autores seleccionados no existen.',
    nombreCompleto: 'El nombre completo es obligatorio.',
    email: 'El email es obligatorio.',
    emailFormato: 'El email no tiene un formato válido.',
    emailDuplicado: 'El email ya está registrado',
    cantidad: 'La cantidad debe ser un entero mayor que cero.'
  };

  var PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function normalizarIsbn(isbn) {
    return String(isbn ?? '').replace(/[\s-]/g, '').toLowerCase();
  }

  function normalizarEmail(email) {
    return String(email ?? '').trim().toLowerCase();
  }

  function indicePorId(coleccion) {
    var indice = new Map();
    if (!Array.isArray(coleccion)) {
      return indice;
    }

    coleccion.forEach(function (registro) {
      if (registro && typeof registro.id === 'string') {
        indice.set(registro.id, registro);
      }
    });

    return indice;
  }

  function normalizarAutorIds(autorIds) {
    var vistos = new Set();
    var normalizados = [];

    if (!Array.isArray(autorIds)) {
      return normalizados;
    }

    autorIds.forEach(function (autorId) {
      var id = String(autorId ?? '').trim();
      if (id === '' || vistos.has(id)) {
        return;
      }
      vistos.add(id);
      normalizados.push(id);
    });

    return normalizados;
  }

  function validarLibro(entrada, contexto) {
    var valores = entrada || {};
    var colecciones = contexto || {};
    var errores = {};

    var titulo = String(valores.titulo ?? '').trim();
    var isbn = String(valores.isbn ?? '').trim();
    var editorialId = String(valores.editorialId ?? '').trim();
    var generoCrudo = String(valores.generoId ?? '').trim();
    var autorIds = normalizarAutorIds(valores.autorIds);

    var precioTexto = String(valores.precio ?? '').trim();
    var precio = precioTexto === '' ? NaN : Number(precioTexto);

    var indiceEditoriales = indicePorId(colecciones.editoriales);
    var indiceGeneros = indicePorId(colecciones.generos);
    var indiceAutores = indicePorId(colecciones.autores);
    var indiceLibros = indicePorId(colecciones.libros);

    if (titulo === '') {
      errores.titulo = MENSAJES.titulo;
    }

    if (isbn === '') {
      errores.isbn = MENSAJES.isbn;
    } else {
      var isbnNormalizado = normalizarIsbn(isbn);
      var duplicado = Array.from(indiceLibros.values()).some(function (libro) {
        return normalizarIsbn(libro && libro.isbn) === isbnNormalizado;
      });
      if (duplicado) {
        errores.isbn = MENSAJES.isbnDuplicado;
      }
    }

    if (!(Number.isFinite(precio) && precio > 0)) {
      errores.precio = MENSAJES.precio;
      precio = null;
    }

    if (editorialId === '' || !indiceEditoriales.has(editorialId)) {
      errores.editorialId = MENSAJES.editorialId;
    }

    var generoId = generoCrudo === '' ? null : generoCrudo;
    if (generoId !== null && !indiceGeneros.has(generoId)) {
      errores.generoId = MENSAJES.generoId;
    }

    if (autorIds.length === 0) {
      errores.autorIds = MENSAJES.autorIds;
    } else {
      var autoresInexistentes = autorIds.some(function (autorId) {
        return !indiceAutores.has(autorId);
      });
      if (autoresInexistentes) {
        errores.autorIds = MENSAJES.autorIdsInexistente;
      }
    }

    return {
      valido: Object.keys(errores).length === 0,
      errores: errores,
      datos: {
        titulo: titulo,
        isbn: isbn,
        precio: precio,
        editorialId: editorialId,
        generoId: generoId,
        autorIds: autorIds
      }
    };
  }

  function validarCliente(entrada, contexto) {
    var valores = entrada || {};
    var colecciones = contexto || {};
    var errores = {};

    var nombreCompleto = String(valores.nombreCompleto ?? '').trim();
    var email = normalizarEmail(valores.email);
    var indiceClientes = indicePorId(colecciones.clientes);

    if (nombreCompleto === '') {
      errores.nombreCompleto = MENSAJES.nombreCompleto;
    }

    if (email === '') {
      errores.email = MENSAJES.email;
    } else if (!PATRON_EMAIL.test(email)) {
      errores.email = MENSAJES.emailFormato;
    } else {
      var duplicado = Array.from(indiceClientes.values()).some(function (cliente) {
        return normalizarEmail(cliente && cliente.email) === email;
      });
      if (duplicado) {
        errores.email = MENSAJES.emailDuplicado;
      }
    }

    return {
      valido: Object.keys(errores).length === 0,
      errores: errores,
      datos: {
        nombreCompleto: nombreCompleto,
        email: email
      }
    };
  }

  function validarCantidad(cantidad) {
    var texto = String(cantidad ?? '').trim();
    var numero = texto === '' ? NaN : Number(texto);

    if (Number.isInteger(numero) && numero > 0) {
      return { valido: true };
    }

    return { valido: false, error: MENSAJES.cantidad };
  }

  TUCO.validaciones = {
    normalizarIsbn: normalizarIsbn,
    normalizarEmail: normalizarEmail,
    validarLibro: validarLibro,
    validarCliente: validarCliente,
    validarCantidad: validarCantidad
  };
})(window);
