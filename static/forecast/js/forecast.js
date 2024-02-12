$(document).ready(function() {
    $('#addLocation').submit(function(e) {
        e.preventDefault();
        var serializedData = $(this).serialize();

        $.ajax({
            type: 'POST',
            url: '/addLocation',
            data: serializedData,
            success: function(response) {
                console.log(response);
            }

        });
    }
    );
}
);
