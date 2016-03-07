/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       navigator.splashscreen.show();
       setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);        
       app.getCategorias();

    },
    alertDismissed: function() {

    },
    getCategorias: function() {
        $.getJSON( "http://api.ofertaspararegalar.com/categorias", function( data ) {
            $.each( data.categorias, function( i, item ) {
               $("#listado-categorias").append('<li><a data-category="'+item.category+'" class="categorydetail" href="#two" ><img class="ui-li-thumb" src="img/'+item.category+'.png"><p> Para '+item.category+'</p></a></li>').listview('refresh');
            });
            $("#cargando").hide();    
        });      
    }    
};
$('#listado-categorias').delegate('a.categorydetail', 'click', function () {
        $("#listado-subcategorias").html("");
        $.getJSON( "http://api.ofertaspararegalar.com/subcategorias/"+$(this).data('category'), function( data ) {
            $.each( data.subcategorias, function( i, item ) {
               $("#listado-subcategorias").append('<li><a class="products2category" data-id="'+item.id+'" href="#three"><h2>'+item.nombre+'</h2></a></li>').listview('refresh');
            });
        });     
});
$('#listado-subcategorias').delegate('a.products2category', 'click', function () {
        $("#listado-productos").html("");
        $.getJSON( "http://api.ofertaspararegalar.com/productosbycat/"+$(this).data('id'), function( data ) {
            $.each( data.productos, function( i, item ) {
               $("#listado-productos").append('<li><a class="productdetail" href="#four" data-foto="'+item.foto+'" data-marca="'+item.marca+'" data-precio="'+item.precio_venta_real+'" data-id="'+item.id+'" data-nombre="'+item.nombre+'" data-codigo="'+item.codigo+'"><img src="http://erp.ofertaspararegalar.com/media/thumbs/'+item.foto+'" /><h2>'+item.nombre+'</h2><h3>'+item.marca+'</h3><p>'+item.codigo+'</p><span class="ui-li-count ui-btn-up-b ui-btn-corner-all">$'+item.precio_venta_real+'</span></a></li>').listview('refresh');
            });
        });     
});
$('#listado-productos').delegate('a.productdetail', 'click', function () {
        $("#codigo_producto").html($(this).data('codigo'));
        $("#nombre_producto").html($(this).data('nombre'));
        $("#precio_producto").html("$"+$(this).data('precio'));
        $("#foto_producto").attr("src","http://erp.ofertaspararegalar.com/media/"+$(this).data('foto'));
        $("#foto_producto").attr("width","100%");
        $("#producto_id").val($(this).data('id'));    
});
$('body').delegate('#apartarbutton', 'click', function () {
    $.mobile.changePage('#five', { transition: "fade"} );
    var codigo = $("#codigo_producto").html();
    var nombre = $("#nombre_producto").html();
    var precio = $("#precio_producto").html();
    var id     = $("#producto_id").val();
    $("#producto").val(nombre+" "+codigo+" "+precio);
    $("#codigo").val(codigo);
    $("#id").val(id);
});
$('body').delegate('#apartarbuttontoserver', 'click', function () {
    var codigo   = $("#codigo").val();
    var producto = $("#producto").val();
    var id       = $("#id").val();    
    var nombre   = $("#nombre").val();    
    var correo   = $("#correo").val();    
    var telefono = $("#telefono").val();    
    $.post( "http://www.ofertaspararegalar.com/apartar.php", { codigo: codigo, producto: producto, id:id, nombre:nombre,email:correo,telefono:telefono }).done(function( data ) {
        alert("Tu producto fue apartado.");        
        $("#codigo").val("");
        $("#producto").val("");
        $("#id").val("");    
        $("#nombre").val("");    
        $("#correo").val("");    
        $("#telefono").val("");          
        $.mobile.changePage('#one', { transition: "fade"} );
    });
});
