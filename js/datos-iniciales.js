(function (global) {
  'use strict';

  var TUCO = global.TUCO = global.TUCO || {};

  TUCO.datosIniciales = {
    editoriales: [
      { id: 'edi-1', nombre: 'Editorial Sudamericana' },
      { id: 'edi-2', nombre: 'Anagrama' },
      { id: 'edi-3', nombre: 'Alfaguara' }
    ],
    generos: [
      { id: 'gen-1', nombre: 'Novela' },
      { id: 'gen-2', nombre: 'Cuento / Ficción' },
      { id: 'gen-3', nombre: 'Cuento / Horror' },
      { id: 'gen-4', nombre: 'Novela policial' }
    ],
    autores: [
      { id: 'aut-1', nombre: 'Jorge Luis', apellido: 'Borges' },
      { id: 'aut-2', nombre: 'Julio', apellido: 'Cortázar' },
      { id: 'aut-3', nombre: 'Gabriel García', apellido: 'Márquez' },
      { id: 'aut-4', nombre: 'Ernesto', apellido: 'Sabato' },
      { id: 'aut-5', nombre: 'Mariana', apellido: 'Enríquez' },
      { id: 'aut-6', nombre: 'Claudia', apellido: 'Piñeiro' }
    ],
    libros: [
      {
        id: 'lib-1',
        titulo: 'Ficciones',
        isbn: '978-950-07-0015-3',
        precio: 15500,
        editorialId: 'edi-1',
        generoId: 'gen-2',
        autorIds: ['aut-1']
      },
      {
        id: 'lib-2',
        titulo: 'Rayuela',
        isbn: '978-950-07-0365-9',
        precio: 18900,
        editorialId: 'edi-1',
        generoId: 'gen-1',
        autorIds: ['aut-2']
      },
      {
        id: 'lib-3',
        titulo: 'Cien años de soledad',
        isbn: '978-950-07-0098-6',
        precio: 21500,
        editorialId: 'edi-1',
        generoId: 'gen-1',
        autorIds: ['aut-3']
      },
      {
        id: 'lib-4',
        titulo: 'El túnel',
        isbn: '978-950-07-0118-1',
        precio: 13200,
        editorialId: 'edi-1',
        generoId: 'gen-1',
        autorIds: ['aut-4']
      },
      {
        id: 'lib-5',
        titulo: 'Las cosas que perdimos en el fuego',
        isbn: '978-987-3951-09-1',
        precio: 16800,
        editorialId: 'edi-2',
        generoId: 'gen-3',
        autorIds: ['aut-5']
      },
      {
        id: 'lib-6',
        titulo: 'Catedrales',
        isbn: '978-987-738-706-3',
        precio: 19700,
        editorialId: 'edi-3',
        generoId: 'gen-4',
        autorIds: ['aut-6']
      }
    ],
    clientes: [
      { id: 'cli-1', nombreCompleto: 'Ana Gómez', email: 'ana.gomez@example.com' },
      { id: 'cli-2', nombreCompleto: 'Bruno Díaz', email: 'bruno.diaz@example.com' },
      { id: 'cli-3', nombreCompleto: 'Carla Ruiz', email: 'carla.ruiz@example.com' }
    ]
  };
})(window);