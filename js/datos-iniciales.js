(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  TUCO.datosIniciales = {
    editoriales: [
      { id: 'edi-1', nombre: 'Editorial Horizonte' },
      { id: 'edi-2', nombre: 'Ediciones del Sur' }
    ],
    generos: [
      { id: 'gen-1', nombre: 'Novela' },
      { id: 'gen-2', nombre: 'Ensayo' }
    ],
    autores: [
      { id: 'aut-1', nombre: 'Elena', apellido: 'Marchetti' },
      { id: 'aut-2', nombre: 'Tomás', apellido: 'Ferrer' },
      { id: 'aut-3', nombre: 'Lucía', apellido: 'Benítez' }
    ],
    libros: [
      {
        id: 'lib-1',
        titulo: 'El jardín de las horas',
        isbn: '978-950-01-0001-1',
        precio: 12500,
        editorialId: 'edi-1',
        generoId: 'gen-1',
        autorIds: ['aut-1']
      },
      {
        id: 'lib-2',
        titulo: 'Cartas al sur',
        isbn: '978-950-01-0002-8',
        precio: 9800,
        editorialId: 'edi-2',
        generoId: 'gen-1',
        autorIds: ['aut-2']
      },
      {
        id: 'lib-3',
        titulo: 'La memoria del agua',
        isbn: '978-950-01-0003-5',
        precio: 14200,
        editorialId: 'edi-1',
        generoId: 'gen-1',
        autorIds: ['aut-1', 'aut-3']
      },
      {
        id: 'lib-4',
        titulo: 'Manual del lector curioso',
        isbn: '978-950-01-0004-2',
        precio: 10500,
        editorialId: 'edi-2',
        generoId: 'gen-2',
        autorIds: ['aut-3']
      },
      {
        id: 'lib-5',
        titulo: 'Ciudades invisibles del norte',
        isbn: '978-950-01-0005-9',
        precio: 11900,
        editorialId: 'edi-1',
        generoId: 'gen-1',
        autorIds: ['aut-2']
      },
      {
        id: 'lib-6',
        titulo: 'Notas sobre el oficio de escribir',
        isbn: '978-950-01-0006-6',
        precio: 8700,
        editorialId: 'edi-2',
        generoId: null,
        autorIds: ['aut-1', 'aut-2']
      }
    ],
    clientes: [
      { id: 'cli-1', nombreCompleto: 'Ana Gómez', email: 'ana.gomez@example.com' },
      { id: 'cli-2', nombreCompleto: 'Bruno Díaz', email: 'bruno.diaz@example.com' },
      { id: 'cli-3', nombreCompleto: 'Carla Ruiz', email: 'carla.ruiz@example.com' }
    ]
  };
})(window);
