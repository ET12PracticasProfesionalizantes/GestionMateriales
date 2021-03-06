let appName = location.pathname.split('/')[1];
let baseURL = window.location.protocol + "//" + window.location.host + "/";
let tablaPersonal;

$(document).ready(function () {

    //if (window.location.href.split(':').length === 2)
    //    baseURL = baseURL + appName + "/";
    
    $('#divgrdPersonal').append('<table id="grdPersonal" class="table table-bordered table-hover"> <thead> <tr> <th> idPersonal </th> <th> Nombre y Apellido </th> <th> Dni </th> <th> Ficha Censal </th> <th> Opciones </th> </tr> </thead> </table>');

    jQuery.fn.dataTable.Api.register('processing()', function (show) {
        return this.iterator('table', function (ctx) {
            ctx.oApi._fnProcessingDisplay(ctx, show);
        });
    });

    loadPersonal();
});

function loadPersonal() {
    $.ajax({
        url: baseURL + "Personal/GetLastUpdated",
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let fecha = '';
            if (data.response.length > 0) {
                fecha = data.response;
            }
            else {
                fecha = new Date().toLocaleString();
            }

            $('#lastUpdated').text('Última modificación ' + fecha);
        }
    });

    if (!$.fn.dataTable.isDataTable('#grdMateriales')) {
        tablaPersonal = $('#grdPersonal').DataTable({
            //"aaData": data.Response,
            "aoColumnDefs": [{
                "targets": [0],
                "visible": false,
                "sType": "html",
                "aTargets": [4]
            }],
            "aoColumns": [
                {
                    "data": "idPersonal"
                },
                {
                    "data": "nombre"
                },
                {
                    "sWidth": "20%",
                    "data": "dni"
                },
                {
                    "sWidth": "20%",
                    "data": "fichaCensal"
                },
                {
                    "sWidth": "10%",
                    "mRender": function (dato, type, row) {
                        var ini = '<div class="row">';

                        var cab = '<div class="col-6 text-center">';

                        var editarHtml = '<a title="Editar" href="' + baseURL + 'Personal/Editar/' + row.idPersonal + '"><i class="fad fa-edit"></i> </a> ';

                        var borrarHtml = '<a title="Borrar" href="" data-toggle="modal" data-target="#myModal-' + row.idPersonal + '" style="color:red"><i class="fad fa-trash-alt"></i> </a><div class="modal fade" id= "myModal-' + row.idPersonal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >' +
                            '<div class="modal-dialog modal-dialog-centered" role="document">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header"><h4 class="modal-title" id="myModalLabel">Borrar Personal</h4></div>' +
                            '<div class="modal-body">' +
                            '<p>¿Desea borrar la siguiente persona del sistema?</p>' +
                            '<p><strong>Nombre y Apellido:</strong> ' + row.nombre + '</p>' +
                            '<p><strong>Ficha Censal:</strong> ' + row.fichaCensal + '</p>' +
                            '<p><strong>DNI:</strong> ' + row.dni + '</p>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<a href="' + baseURL + 'Personal/Borrar/' + row.idPersonal + '" type="button" class="btn btn-outline-danger"><i class="fad fa-check"></i> Aceptar</a>' +
                            '<button type="button" class="btn btn-outline-primary" data-dismiss="modal"><i class="fad fa-times"></i> Cancelar</button>' +
                            '</div></div></div></div></div>';

                        var end = '</div>';

                        return ini + cab + editarHtml + end + cab + borrarHtml + end + end;
                    }
                }],
            "order": [1, "asc"],
            "processing": true
        });
    }

    tablaPersonal.processing(true);

    let req = $.ajax({
        url: baseURL + "Personal/GetAll",
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async: true
    });

    req.done(function (data) {
        tablaPersonal.clear();
        tablaPersonal.rows.add(data.response);
        tablaPersonal.draw();
        tablaPersonal.processing(false);
    });

    req.fail(function (data) {
        console.log(data.response);
        alert('No se pueden cargar el listado de personal');
    });
}
