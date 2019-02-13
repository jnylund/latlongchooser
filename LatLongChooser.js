import {LitElement, html} from 'lit-element';
import '@polymer/paper-dialog/paper-dialog.js';
import "google-maps-limited/google-maps-limited.js";

/**
 * LatLongChooser is a webcomponent that uses lit-html library for extra features
 * The purpose of this component is to use a dialog to allow user to input lat/long several ways
 * including deg/min/seconds, decimal degrees, and map
 *
 *  @event lag-long-chosen
 *  @type CustomEvent
 * 
 *  showLatLongDialog() - allows external users to open the dialog
 */
export class LatLongChooser extends LitElement {

     
    static get properties() {
        return {
          buttonBackgroundColor: String,
          buttonForegroundColor: String,
          latDegrees: Number,
          latMinutes: Number,
          latSeconds: Number,
          longDegrees: Number,
          longMinutes: Number,
          longSeconds: Number,
          latDirection: String,
          longDirection: String,
          latDecimalDegrees: Number,
          longDecimalDegrees: Number,
          mapMarkers: Array
        };
      }

      /**
       * Opens the dialog
       */
       showLatLongDialog(){
        console.log("toggle popup called on component")
        //this.shown = !this.shown

        let dialog = this.shadowRoot.getElementById("dialog")
        dialog.open()

      
      }

      /**
       * Updates other values on this dialog, not public
       */
      updateOtherValues() {

        // No 2 way binding in lit-html.... This is yucky, must be a better way right?
         this.latDegrees = parseInt(this.shadowRoot.getElementById("latDegrees").value);
         this.latMinutes = parseFloat(this.shadowRoot.getElementById("latMinutes").value);
         this.latSeconds = parseFloat(this.shadowRoot.getElementById("latSeconds").value);
         this.latDirection = this.shadowRoot.getElementById("lat-direction").value;
         
         this.longDegrees = parseInt(this.shadowRoot.getElementById("longDegrees").value);
         this.longMinutes = parseFloat(this.shadowRoot.getElementById("longMinutes").value);
         this.longSeconds = parseFloat(this.shadowRoot.getElementById("longSeconds").value);
         this.longDirection = this.shadowRoot.getElementById("long-direction").value;


          console.log("update other values was called")
          this.latDecimalDegrees = this.degreesMinsSecsToDecimal(this.latDegrees, this.latMinutes, this.latSeconds, this.latDirection);
          this.longDecimalDegrees = this.degreesMinsSecsToDecimal(this.longDegrees, this.longMinutes, this.longSeconds, this.longDirection);
         
          // Remove any existing markers
          this.shadowRoot.querySelector('google-maps-limited').markers =  [];

          this.shadowRoot.querySelector('google-maps-limited').markers =  [
            {
              position: {lat:this.latDecimalDegrees, lng:this.longDecimalDegrees},
              InfoWindowContent: "Selection Marker"
            }
          ]
      }

      /**
       * Closes the dialog and sends an event with the decimal lag/long to caller
       */
      saveConvertedValues() {
        console.log("save converted values called");

        // close the dialog
        let dialog = this.shadowRoot.getElementById("dialog")
        dialog.close();

        // dispatch the event to the caller so they can get the decimal lat/long
        this.dispatchEvent(new CustomEvent('lag-long-chosen', {bubbles:true, composed:true, detail:{lat:this.latDecimalDegrees, long: this.longDecimalDegrees}}));
      }

      /**
       * Used to convert deg/min/sec/direction to decimal
       * @param Number degrees
       * @param Number minutes
       * @param Number seconds
       * @param String direction
       */
      degreesMinsSecsToDecimal(degrees,minutes,seconds,direction) {
      
        var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
      }


      decimalToDMS(lat, lng) {
 
        var convertLat = Math.abs(lat);
        var LatDeg = Math.floor(convertLat);
        var LatMin = (Math.floor((convertLat - LatDeg) * 60));
        var LatSeconds = (Math.floor((convertLat - LatDeg) * 3600));
        var LatCardinal = ((lat > 0) ? "N" : "S");
         
        var convertLng = Math.abs(lng);
        var LngDeg = Math.floor(convertLng);
        var LngMin = (Math.floor((convertLng - LngDeg) * 60));
        var LngSeconds = (Math.floor((convertLng - LngDeg) * 3600));
        var LngCardinal = ((lng > 0) ? "E" : "W");
         
        //return LatDeg + LatCardinal + LatMin  + "<br />" + LngDeg + LngCardinal + LngMin;
        return [LatDeg,LatMin,LatSeconds,LatCardinal,LngDeg,LngMin,LngSeconds,LngCardinal];
}




      /**
       * Used to build this compoenents default info
       * @constructor
       */
      constructor() {
        super();
        this.latDegrees = 38;
        this.latMinutes = 9;
        this.latSeconds = 43.9416;
        this.latDirection = "N"

        this.longDegrees = 93;
        this.longMinutes = 9;
        this.longSeconds = 50.6268;
        this.longDirection = "W"

        if (typeof this.buttonBackgroundColor == 'undefined')
          {
            this.buttonBackgroundColor = "blue";

          }
          if (typeof this.buttonForegroundColor == 'undefined')
          {
            this.buttonForegroundColor = "white";

          }

         this.mapMarkers  = [
          {
            position: {lat:41, lng:-112},
            InfoWindowContent: "<h3>The Salt Lake City, UT Temple</h3>"
          }  ]

          this.addEventListener('lag-long-chosen', (e) => {
            console.log("got event from map")
            this.updateFromMap(e);
          });   
      }


      updateFromMap(e)
      {
        var latDegrees = e.detail.lat;
        var longDegrees = e.detail.long;
        var latLocalElement = document.getElementById("latDecimalId");
        this.shadowRoot.getElementById("dec-lat-degrees").value = latDegrees;
        this.shadowRoot.getElementById("dec-long-degrees").value = longDegrees;
        // todo update degrees mins secs
        let dmsResuslts = this.decimalToDMS(latDegrees,longDegrees);
        // [LatDeg,LatMin,LatSeconds,LatCardinal,LngDeg,LngMin,LngSeconds,LngCardinal];

        this.shadowRoot.getElementById("latDegrees").value = dmsResuslts[0];
        this.shadowRoot.getElementById("latMinutes").value = dmsResuslts[1];
        this.shadowRoot.getElementById("latSeconds").value = dmsResuslts[2];
        this.shadowRoot.getElementById("lat-direction").value = dmsResuslts[3];
        
        this.shadowRoot.getElementById("longDegrees").value = dmsResuslts[4];
        this.shadowRoot.getElementById("longMinutes").value = dmsResuslts[5];
        this.shadowRoot.getElementById("longSeconds").value = dmsResuslts[6];
        this.shadowRoot.getElementById("long-direction").value = dmsResuslts[7];


      }

       /**
       * Renders the template and shadowDom styles
       */  
      render() {
        return html`
       
        <paper-dialog id="dialog" >
             <style>
               .groupBox {
                padding-right: 20px;
                padding-left: 20px;
                padding-bottom: 20px;
                padding-top: 5px;
                border-style: inset;
               }
               .spacerdiv {
                 padding: 5px;
               }
              .degminsec { 
                display: flex;
              }
              label {
                padding-right: 15px;
                padding-left: 15px;
              }
              .gmap {
                height: 200px;
                width: 300px;
              }
              .convert-btn {
                background-color: ${this.buttonBackgroundColor};
                color: ${this.buttonForegroundColor};
                padding: 15px 25px;
                display: inline-block;
              }
              google-maps-limited {
                 height: 300px;
                 width: 600px;
              }
             </style>
            <h2>Please find your location using Degrees Minutes Seconds Format:</h2>
         <form>
            <div class="groupBox">
              <h3><slot name="degrees-mins-secs-title">Degrees Minutes Seconds</slot></h3>
              <p><slot name="latitude-title">Latitude:</slot></p>
              <div class="degminsec">
                <div>
                <label for="degrees">Degrees:</label><input type="text" name="lat-degrees" .value="${this.latDegrees}" id="latDegrees"><br>
                </div>
                <div>
                <label for="minutes">Minutes:</label><input type="text" name="lat-minutes" .value="${this.latMinutes}" id="latMinutes">
                </div>
                <div>
                <label for="seconds">Seconds:</label><input type="text" name="lat-seconds" .value="${this.latSeconds}" id="latSeconds">
                </div>
                <div>
                <label for="direction">Direction:</label>
                  <select id="lat-direction">
                    <option value="N" ?selected=${this.latDirection === "N"}>North</option>
                    <option value="S" ?selected=${this.latDirection === "S"}>South</option>
                  </select>
                </div>
              </div>

              <p><slot name="longitude-title">Longitude:</slot></p>
              <div class="degminsec">
                <div>
                <label for="degrees">Degrees:</label><input type="text" name="long-degrees" .value="${this.longDegrees}" id="longDegrees"><br>
                </div>
                <div>
                <label for="minutes">Minutes:</label><input type="text" name="long-minutes" .value="${this.longMinutes}" id="longMinutes">
                </div>
                <div>
                <label for="seconds">Seconds:</label><input type="text" name="long-seconds" .value="${this.longSeconds}" id="longSeconds">
                </div>
                <div>
                <label for="direction">Direction:</label>
                  <select id="long-direction">
                    <option value="E">East</option>
                    <option value="W" selected>West</option>
                  </select>
                </div>
              </div>
              <div class="spacerdiv"> </div>
               <div>
                  <button type="button" class="convert-btn" @click="${this.updateOtherValues}">Convert</button>
                </div>
              </div>
  
              <div class="spacerdiv"> </div>
  
              <div class="groupBox">
                <h3><slot name="dec-degrees-title">Decimal Degrees</slot></h3>
                <div class="degminsec">
                  <div>
                    <label for="degrees">Latitude:</label><input type="text" id="dec-lat-degrees" name="dec-lat-degrees" .value="${this.latDecimalDegrees}"><br>
                  </div>
                  <div>
                    <label for="degrees">Logitude:</label><input type="text" id="dec-long-degrees" name="dec-long-degrees" .value="${this.longDecimalDegrees}">
                  </div>
                </div>
              </div>
            
                    
             <div class="spacerdiv"> </div>
             <div class="groupBox">
                <h3><slot name="map-title">Map Location</slot></h3><br/>
                <div>
                  <google-maps-limited apiKey="" >
                   </google-maps-limited>
                </div>
            </div>

            <div class="spacerdiv"> </div>
            <div>
               <button type="button" class="convert-btn" @click="${this.saveConvertedValues}">Save</button>
             </div>
           </div>
         </form>

       </paper-dialog>
      `;
      }

      /**
       * Once the component is drawn, add handler to listen for dialog close, for demo only, not used
       */
      firstUpdated(changedProperties) {
        console.log("firstUpdated called")
        let dialog = this.shadowRoot.getElementById("dialog")
        
        dialog.addEventListener('iron-overlay-closed', function(e){
            console.log("dialog trying to close")
          });

      }

      /**
       * Called when component is upudated, for demo only, not used
       */
      updated(changedProperties){
          console.log("updated called")
      }

    
    }
    
    // Define the element
    customElements.define("lat-long-chooser", LatLongChooser);