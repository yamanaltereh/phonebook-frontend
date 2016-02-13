'use strict';

angular.module('PhoneBookApp')
  .constant("baseURL","http://localhost:3000/")
  .service('contactsService', ['$resource', 'baseURL', function($resource,baseURL) {
    return $resource(baseURL+"contacts/:id", { id: "@id" },
      {
        'create':  { method: 'POST', isArray: false },
        'index':   { method: 'GET', isArray: true },
        'update':  { method: 'PUT', isArray: false},
        'destroy': { method: 'DELETE' },
        'export': {
          url: baseURL+'/contacts/export',
          method: 'GET',
          isArray: false
        },
        'import': {
          url: baseURL+'/contacts/import',
          method: 'POST',
          isArray: false
        }
      }
    );
  }]);