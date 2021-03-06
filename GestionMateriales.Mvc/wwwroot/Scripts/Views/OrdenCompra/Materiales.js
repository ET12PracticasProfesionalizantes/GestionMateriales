var appName = location.pathname.split('/')[1];
var baseURL = window.location.protocol + "//" + window.location.host + "/";

$(document).ready(function () {

    if (window.location.href.split(':').length == 2)
        baseURL = baseURL + appName + "/";

    CalcularTotalOrdenCompra();

    var request = $.ajax({
        url: baseURL + "OrdenCompra/GetMateriales",
        type: 'GET',
        data: { id: $('#IdOc').val() },
        contentType: 'application/json; charset=utf-8'
    });

    request.done(function (data) {
        console.log(data.Response);
        tablaMateriales = $ ('#grdMateriales').DataTable({
            "aaData" : data.Response,
            "aoColumnDefs": [{
                "targets": [0, 1],
                "visible": false,
                "sType": "html",
                "aTargets": [4,5,6]
            }],
            "aoColumns": [
                {
                    "data" : "idOC"
                },
                {
                    "data" : "idMat"
                },
                {
                    "sWidth": "7%",
                    "data" : "codMat"
                },
                {
                    "sWidth": "60%",
                    "data" : "nomMat"
                },
                {
                    "sWidth": "10%",
                    "data" : "cantidad",
                    "mRender": function (dato, type, raw) {
                        var editarCant = '<input id="iCant-' + raw.idOC + '-' + raw.idMat + '" type="number" min="0" class="form-control form-control-sm" onkeyup="CalcularSubtotal('+ raw.idOC +', '+ raw.idMat +')" value="'+ raw.cantidad +'"/>';
                        return editarCant;
                    }
                },
                {
                    "sWidth": "10%",
                    "data" : "precioUnitario",
                    "mRender": function (dato, type, raw) {
                        var header = '<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text">$</span></div>';
                        var editarCant = '<input id="iPre-' + raw.idOC + '-' + raw.idMat + '" type="text" class="form-control" onkeyup="CalcularSubtotal(' + raw.idOC + ',' + raw.idMat + ')" value="' + raw.precioUnitario + '">';
                        var footer = '</div>';
                        return header + editarCant + footer;
                    }

                },
                {
                    "sWidth": "10%",
                    "data" : "subTotal",   
                    "mRender": function (dato, type, raw) {
                        var header = '<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text">$</span></div>';
                        var subtotal = '<input id="iSub-' + raw.idOC + '-' + raw.idMat + '" type="text" class="form-control" readonly value="' + raw.subtotal + '"/>';
                        var footer = '</div>';
                        return header + subtotal + footer;
                    }
                },
                {
                    "sWidth": "5%",
                    "mRender": function (dato, type, raw) {

                        var btnAgregarItemOC = '<button type="button" title="Agrega el item a la Orden de Compra" class="btn btn-outline-primary btn-sm" href="" id="itemOC-' + raw.idOC + '-' + raw.idMat + 
                            '" onclick="AgregarItemOC(this);"><i class="fas fa-plus"></i></button> ';
                        return btnAgregarItemOC;
                    }
                }],
            "order": [3, "asc"]
            });
    });                  
});

function CalcularSubtotal(idOC, idMat)
{
    var cantidad = parseInt($('#iCant-' + idOC + '-' + idMat).val());

    var precioUnitario = parseFloat($('#iPre-' + idOC + '-' + idMat).val().replace(',', '.'));

    var subtotal = cantidad * precioUnitario;

    $('#iSub-' + idOC + '-' + idMat).val(subtotal);
}

function AgregarItemOC(data) {
    var idOC = data.id.split('-')[1];
    var idMaterial = data.id.split('-')[2];
    //var destino = $('#iDes-' + idOC + '-' + idMaterial).val();
    var cantidad = $('#iCant-' + idOC + '-' + idMaterial).val();
    var precioUnitario = $('#iPre-' + idOC + '-' + idMaterial).val().replace('.', ',');
    var subtotal = $('#iSub-' + idOC + '-' + idMaterial).val().replace('.', ',');
    //console.log(`${idOC} ${idMaterial} ${cantidad} ${precioUnitario} ${subtotal}`);

    var request = $.ajax({
        url: baseURL + "OrdenCompra/AgregarItemMaterial",
        type: 'POST',
        data: "{ 'id': '" + idOC + "', 'idMaterial':'" + idMaterial + "', 'unaCantidad':'" + cantidad + "', 'unPrecioUnitario':'" + precioUnitario + "', 'unSubtotal':' " + subtotal + "' }",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    });

    request.done(function () {
        ShowNotificationSuccess('Orden de Compra');
        CalcularTotalOrdenCompra();
    });

    request.fail(function () {
        //console.log(data.Response);
        ShowNotificationDanger('Orden de Compra', 'No se puede agregar el material, verifique la Cantidad y Precio');
    });
}

function CalcularTotalOrdenCompra() {
    var request = $.ajax({
        url: baseURL + "OrdenCompra/Get_Materiales_TotalOrdenCompra",
        type: 'GET',
        data: { id: $('#IdOc').val() },
        contentType: 'application/json; charset=utf-8'
    });

    request.done(function (data) {
        $("#totalOC").text(data.Response.toString().replace('.', ','));
    });

    request.fail(function () {
        console.log(data.Response);
        alert('No se pueden cargar el total de la Orden de Compra');
    });
}