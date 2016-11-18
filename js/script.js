$(document).ready(function () {

    var map;
    var service;
    var loc;

    function initialize() {

        var pyrmont;

        if (loc === 'Warszawa') {
            pyrmont = new google.maps.LatLng(52.2297, 21.0122);
        }
        else if (loc === 'Gdańsk') {
            pyrmont = new google.maps.LatLng(54.2107, 18.3846);
        }
        else if (loc === 'Kraków') {
            pyrmont = new google.maps.LatLng(50.0647, 19.9450);

        }
        else if (loc === 'Wrocław') {
            pyrmont = new google.maps.LatLng(51.1079, 17.0385);
        }

        map = new google.maps.Map(document.createElement('div'), {
            center: pyrmont,
            zoom: 15
        });

        var request = {
            location: pyrmont,
            radius: '50000',
            type: ['cafe']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            $('.location-selection')
                .append('<div id="cafe-selection">' +
                    '<h3><label for="cafe-options">Step 2: Choose your cafe:</label></h3>' +
                    '<select class="form-control" id="cafe-options" name="chosen-cafe" required>' +
                    '<option class="blank-cafe"></option></select></div>');
            for (var i = 0; i < results.length; i++) {
                var address = results[i].vicinity,
                    name = results[i].name;
                $('#cafe-options').append($('<option>').html(name + ', ' + address))
            }
            $('#cafe-options').on("change", function () {
                $('.cake-form-section').css('display', 'block');
                $('.blank-cafe').remove();
            })
        }
        else {
            alert("Unfortunately, we can't find any cafe near you :(")
        }
    }

    $('#city').on("change", function () {
        $('#cafe-selection').remove();
        $('.blank-city').remove();
        loc = $('#city').val();
        initialize();
    })

    $('#flavor-selection').on("change", function () {
        $('.blank-flavor').remove();
    })

    function validationCheck(elements, criteria, output) {
        var checks = [];
        elements.each(function (index, element) {
            var valueToCheck = $(element).val();

            $(element).next('p').remove()

            if (!criteria.test(valueToCheck) && valueToCheck !== '') {
                $(element).after($('<p>').text(output));
                checks.push(false);
            } else if ($(element).prop("required") && valueToCheck === '') {
                $(element).after($('<p>').text('This field can\'t be empty'));
                checks.push(false);
            } else {
                $(element).next('p').remove();
                checks.push(true);
            }
        })
        return checks.indexOf(false) === -1;
    }

    function validateForm() {
        var lettersOnly = $('.letters-only'),
            lettersOnlyExpresion = /[A-Za-z]+$/,
            numbersOnly = $('input[type="tel"]'),
            numbersOnlyExpresion = /.*[0-9].*/,
            email = $('input[type="email"]'),
            emailExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        var check1 = validationCheck(
            lettersOnly,
            lettersOnlyExpresion,
            'You can only use letters here'
        );

        var check2 = validationCheck(
            numbersOnly,
            numbersOnlyExpresion,
            'You can only use numbers here'
        );

        var check3 = validationCheck(
            email,
            emailExpression,
            'Please provide valid e-mail address'
        );

        return (check1 && check2 && check3);
    }

    $('input[type="submit"]').click(function (event) {
        validateForm() ?
            $.ajax({
                url: 'http://rest.learncode.academy/api/customcake/order',
                type: "POST",
                data: $('form').serialize()
            }).done(function (response) {
                alert('Your order has been placed! Your delicious cake will be ready tomorrow!')
            }).fail(function (response) {
                alert('Something went wrong :( Please try to place order again')
            }) : alert('Please fill in all the required fields with valid information')
        event.preventDefault();
    })
})
