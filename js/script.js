var Map = function(){
  var self = this;
  self.map = null;
  self.mapCenterLat = 39.384627;
  self.mapCenterLng = -76.606465;
  self.mapOptions = {
    center: new google.maps.LatLng( self.mapCenterLat,
                                    self.mapCenterLng ),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  self.mapBounds = null;
  self.mapDiv = document.getElementById( 'map' );

  self.initializeMap = function(){
    self.map = new google.maps.Map( self.mapDiv,
                                    self.mapOptions );
    self.mapBounds = new google.maps.LatLngBounds();
    self.addMarker();
  };

  self.addMarker = function(){
    var service = new google.maps.places.PlacesService( self.map );
    var request = { query: "7313 York Road, Towson, MD" };
    service.textSearch( request, self.callback() );
  };

  self.callback = function(){
    return function( results, status ){
      if( status == google.maps.places.PlacesServiceStatus.OK ){
        window.setTimeout( self.getCallback( results[0] ), 100 );
      }
    }
  };

  self.getCallback = function( results ){
    return function(){
      self.createMapMarker( results );
    }
  };

  self.createMapMarker = function( place ){
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    var name = place.formatted_address;

    var marker = new google.maps.Marker( {
      animation: google.maps.Animation.DROP,
      map: self.map,
      position: place.geometry.location,
      title: name
    });

    self.mapBounds.extend( new google.maps.LatLng( lat, lng ) );

    // add and display infoWindow
    var content_string = '<div id="iwin">'+
      '<span class="ilink">'+
      '<a target="_blank" href="https://www.google.com/maps/dir//7313+York+Road+Towson+MD+21204">'+
      'Get Directions</a></span></div>';

    var infowindow = new google.maps.InfoWindow({
      content: content_string
    });
    infowindow.open(self.map, marker);

    marker.addListener( 'click', function(){
      infowindow.open(self.map, marker);
    });
  };
}

$(function(){
  $("#main_menu").click( function( ev ){
    // make current tab active
    $("#main_menu li").each( function(){
      $(this).removeClass("active");
    });

    // if hamburger menu, collapse
    $(this).collapse('hide');

    // make clicked menu item active
    var $target = $( ev.target );
    $target.parent().addClass( "active" );

    // find visible section
    var $sec_hide = $("section:visible");
    var sec_show = "#" + $(ev.target).html();
    $sec_hide.each( function(){
      $(this).fadeOut( function(){
        $(sec_show).fadeIn( function(){
          if( sec_show === "#Contact" ){
            // show google map
            if( gm.map == null ){
              showMap();
            } else {
              google.maps.event.trigger( gm.map, 'resize' );
            }
          }
        });
      });
    });
  });
});

var gm = new Map();
window.addEventListener( 'resize', function(){
  if( $("#Contact").is(":visible")){
    var tbl_ht = $("#Contact table").height();
    var tbl_wd = $("#Contact table").width();
    if( tbl_ht > 0 ){
      $(".map_container").height( tbl_ht );
      $(".map_container").width( tbl_wd );
    }
    google.maps.event.trigger( gm.map, 'resize' );
    // TODO remove
    gm.map.fitBounds( gm.mapBounds );
    gm.map.setCenter( new google.maps.LatLng( gm.mapCenterLat,
                                              gm.mapCenterLng) );
    gm.map.setZoom( 15 );
  }
});

function showMap(){
  // google map
  var tbl_ht = $("#Contact table").height();
  var tbl_wd = $("#Contact table").width();
  if( tbl_ht > 0 ){
    $(".map_container").height( tbl_ht );
    $(".map_container").width( tbl_wd );
    gm.initializeMap();
  }
}
