[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/solutionstreet/latlongchooser)

# \<lat-long-chooser\>

A Polymer (lit-element) to choose latitude and longitude.

## Running locally

```
$ npm install
$ polymer serve
```

[then open "http://127.0.0.1:8081/components/@solutionstreet/latlongchooser/" in your browser](http://127.0.0.1:8081/components/@solutionstreet/latlongchooser/)

This component has 2 properties to style the buttons
There are slots for all the title text
This button sends an custom event called lag-long-chosen, see example below for details


## Example

```html
<lat-long-chooser buttonBackgroundColor="red" buttonForegroundColor="yellow">
  <script>
         <span slot="degrees-mins-secs-title">Deg/Min/Sec<span>
            <span slot="latitude-title">Lat:</span>
            <span slot="longitude-title">Long:</span>
            <span slot="dec-degrees-title">Degrees in Decimal Form:</span>
            <span slot="map-title">My Map Locator:</span>
          var latLongDialog = document.getElementById('latLongDialog');
           latLongDialog.addEventListener('lag-long-chosen', function(e){
            console.log("got event from dialog")
            var latDegrees = e.target.latDecimalDegrees;
            var longDegrees = e.target.longDecimalDegrees;
            var latLocalElement = document.getElementById("latDecimalId")
            latLocalElement.innerHTML = latDegrees
            var longLocalElement = document.getElementById("longDecimalId")
            longLocalElement.innerHTML = longDegrees
          });   
  </script>
</lat-long-chooser>
```

