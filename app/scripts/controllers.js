'use strict';

angular.module('PhoneBookApp')
  .controller('ContactController', ['$scope', 'baseURL', 'contactsService','$window', 'Upload', function($scope, baseURL, contactsService, $window, Upload) {
    $scope.alert = { type: 'danger', message: '' };
    $scope.closeAlert = function() {
        $scope.alert = null;
    }
    $scope.hasError = false;
    $scope.success = false;
    $scope.alert.message = "";
    var refrechContacts = function() {
      contactsService.index(
        function(response){
            $scope.contacts = response;
        },
        function(response) {
            console.log(response);
            $scope.hasError = true;
            $scope.alert.type = 'danger'
            $scope.alert.message = "Error: "+response.status + " " + response.statusText;
        });
    };
    refrechContacts();

    $scope.titleContact = function(contact) {
      if (contact.isNew) {
        return "new contact";    
      }
      return contact.name + ", Phone: " + contact.phone;
    };

    $scope.addContact = function() {
      var newContact = {};
      newContact.open = true;
      newContact.isNew = true;
      $scope.contacts.push(newContact);
    };

    $scope.saveContact = function(contact) {
      if (contact.isNew) {
        contactsService.create({}, contact,
            function(response){
              refrechContacts();
              $scope.success = true;
              $scope.alert.type = "success";
              $scope.alert.message = "Added new contact successfully";
            },
            function(response) {
              $scope.hasError = true;
              $scope.alert.type = 'danger'
              $scope.alert.message = "Error: "+response.status + " " + response.statusText;
            });
      } else {
        contactsService.update({id: contact.id}, contact,
            function(response){
              refrechContacts();
              $scope.success = true;
              $scope.alert.type = "success";
              $scope.alert.message = "Updated contact successfully";
            },
            function(response) {
              $scope.hasError = true;
              $scope.alert.type = 'danger'
              $scope.alert.message = "Error: "+response.status + " " + response.statusText;
            });
      }
    };

    $scope.deleteContact = function(contact) {
      contactsService.destroy({id: contact.id},
        function(response){
          refrechContacts();
          $scope.success = true;
          $scope.alert.type = "success";
          $scope.alert.message = "Deleted new contact successfully";
        },
        function(response) {
          $scope.hasError = true;
          $scope.alert.type = 'danger'
          $scope.alert.message = "Error: "+response.status + " " + response.statusText;
        });                
    };

    $scope.exportContacts = function() {
        var url = baseURL + "contacts/export";
        $window.location = url;
      // contactsService.export({}).$promise.then(
      //   function(response){
      //     console.log(response);
      //     var file = response
      //     var fileName = response.fileName || 'contacts.txt';
      //     $window.saveAs(file, fileName);
      //   }, function(response){
      //     $scope.hasError = true;
      //     $scope.alert.message = "Error: "+response.status + " " + response.statusText;
      //   })
    };

    $scope.importContacts = function(file) {
      Upload.upload({
          url: baseURL + "contacts/import",
          data: {file: file}
      }).then(function (response) {
          $scope.success = true;
          $scope.alert.type = "success";
          $scope.alert.message = "Imported contacts successfully";
          refrechContacts();
      }, function (response) {
          $scope.hasError = true;
          $scope.alert.type = 'danger'
          $scope.alert.message = "Error: "+response.status + " " + response.statusText;
      });
    //   contactsService.import(fd,
    //     function(response){
    //       console.log(response);
    //     }, function(response){
    //       $scope.hasError = true;
    //       $scope.alert.message = "Error: "+response.status + " " + response.statusText;
    //     })
    };
  }]);