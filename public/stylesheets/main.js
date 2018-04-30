$(document).ready(function () {

            $('#btn1').on('click', function (e) {
              $('#btn1').each(function () {
                $(this).addClass('active');
              });

            });
          });
