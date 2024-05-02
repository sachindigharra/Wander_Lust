
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 8  // starting zoom
    });
    const marker1 = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>l${listing.title}</h4><p>exact location will be provide after book</p> `))
        .addTo(map);

      
