(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', datacontext]);

    function datacontext(common) {
        var $q = common.$q;

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getTickets: getTickets
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getCompany() {
            var company = [];
            return $q.when(company);
        }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function getTickets() {
            var ticket = [
                {   ticketId: 1, 
                    serviceTech: "1222",
                    routeId: 1, 
                    srvLoc: {
                        firstName: 'Chris', 
                        lastName: 'Trees', 
                        phone: '515.999.0007', 
                        email: 'christrees@gmail.com', 
                        address: '999 Technology Road', 
                        city: 'Winfield', 
                        state: 'Ia', 
                        zip: '52659'
                    }, 
                    billTo: {
                        firstName: 'Chris', 
                        lastName: 'Trees', 
                        phone: '515.999.0007', 
                        email: 'christrees@gmail.com', 
                        address: '999 Technology Road', 
                        city: 'Winfield', 
                        state: 'Ia', 
                        zip: '52659'
                    }, 
                    contact: {
                        name: 'Chris Trees', 
                        phone: '515.999.0007', 
                        email: 'christrees@gmail.com', 
                    },
                    srv: {
                        date: "2014.01.11",
                        time: "10:22 AM",
                        dec: "Service description default text.", 
                        note: "Service Note default", 
                        bal: "33.33", 
                        fee: "33.33", 
                        tax: "3.33", 
                        taxRate: "10", 
                        total: "69.99",
                        status: "charge"
                    }
                },
               {   ticketId: 2, 
                    routeId: 2, 
                    serviceTech: "1322",
                    srvLoc: {
                        firstName: 'Alan', 
                        lastName: 'Trees', 
                        phone: '515.999.0000', 
                        email: 'altrees@yahoo.com', 
                        address: '123 Main Street', 
                        city: 'Winfield', 
                        state: 'Ia', 
                        zip: '52659'
                    }, 
                    billTo: {
                        firstName: 'Chris', 
                        lastName: 'Trees', 
                        phone: '515.999.0007', 
                        email: 'christrees@gmail.com', 
                        address: '999 Technology Road', 
                        city: 'Winfield', 
                        state: 'Ia', 
                        zip: '52659'
                    }, 
                    contact: {
                        name: 'Alan Trees', 
                        phone: '515.999.9999', 
                        email: 'altrees@yahoo.com', 
                    },
                    srv: {
                        date: "2014.01.11",
                        time: "10:22 AM",
                        dec: "Service description default text.", 
                        note: "Service Note default", 
                        bal: "33.33", 
                        fee: "33.33", 
                        tax: "3.33", 
                        taxRate: "10", 
                        total: "69.99" 
                        status: "check"
                    }
                }
         
            ];
            return $q.when(ticket);
        }

        function getContacts() {
            var contacts = [
                { contactId: 0, firstName: 'default', lastName: 'account', phone: '555.555.5555', email: 'test@test.com', address: '123 Main Street', city: 'Winfield', state: 'Ia', zip: '52659'},
                { contactId: 1, firstName: 'Chris', lastName: 'Trees', phone: '515.999.0007', email: 'christrees@gmail.com', address: '123 Main Street', city: 'Winfield', state: 'Ia', zip: '52659'},
                { contactId: 2, firstName: 'Alan', lastName: 'Trees', phone: '515.999.0007', email: 'altrees@yahoo.com', address: '123 Main Street', city: 'Winfield', state: 'Ia', zip: '52659'},
                { contactId: 3, firstName: 'Alice', lastName: 'Trees', phone: '515.999.0007', email: 'altrees@yahoo.com', address: '123 Main Street', city: 'Winfield', state: 'Ia', zip: '52659'},

            ];
            return $q.when(contacts);
        }
    }
})();