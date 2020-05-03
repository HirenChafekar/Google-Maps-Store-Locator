
window.onload = () =>{          //window.onload = function{...}
    
}

var map;
var markers = [];
var infoWindow;


function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };
    
    map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    maxZoom: 12.5,
    mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}


function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    console.log(zipCode);
    if (zipCode){
        for (var store of stores){
            var postalCode = store['address']['postalCode'].substring(0,5);
            if(postalCode == zipCode){
                foundStores.push(store);
            }
       }
    } else{
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoreMarkers(foundStores);
    setOnClickListner();
}

function clearLocations(){
    infoWindow.close();
         for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null);
         }
         markers.length = 0;

}

function setOnClickListner(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem,index){
        elem.addEventListener('click',function(){
            new google.maps.event.trigger(markers[index],'click');
        })
    })
}


function displayStores(stores){
    var storeHtml ='';
    for (var [index, store] of stores.entries()){
        var address = store['addressLines'];
        var phone = store['phoneNumber'];

        storeHtml +=`
        <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">                        
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>  
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                    ${index+1}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.querySelector('.stores-list').innerHTML = storeHtml;
    }
}


function showStoreMarkers(stores){
    for (var [index, store] of stores.entries()){
        var bounds = new google.maps.LatLngBounds();
        var name=store["name"];
        var openStatusText = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        var address=store["addressLines"][0];
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]
        );
        bounds.extend(latlng);
        createMarker(latlng,name,address,openStatusText, phoneNumber,index+1);
    }
    map.fitBounds(bounds);
}


function createMarker(latlng,name,address,openStatusText,phoneNumber,index){
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    
    `;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label:index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}