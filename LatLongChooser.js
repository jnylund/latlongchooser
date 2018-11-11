import {LitElement, html} from '@polymer/lit-element';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

export class LatLongChooser extends LitElement {

     
    static get properties() {
        return {
          welcomeCounter: Number,
          latDegrees: Number,
          latMinutes: Number,
          latSeconds: Number,
          longDegrees: Number,
          longMinutes: Number,
          longSeconds: Number,
          latDirection: String,
          longDirection: String,
          latDecimalDegrees: Number,
          longDecimalDegrees: Number
        };
      }

      showLatLongDialog(){
        console.log("toggle popup called on component")
        //this.shown = !this.shown

        let dialog = this.shadowRoot.getElementById("dialog")
        dialog.open()
      }

      updateOtherValues() {

         this.latDegrees = parseInt(this.shadowRoot.getElementById("latDegrees").value);
         this.latMinutes = parseFloat(this.shadowRoot.getElementById("latMinutes").value);
         this.latSeconds = parseFloat(this.shadowRoot.getElementById("latSeconds").value);
         this.latDirection = this.shadowRoot.getElementById("lat-direction").value;


          console.log("update other values was called")
          this.latDecimalDegrees = this.degreesMinsSecsToDecimal(this.latDegrees, this.latMinutes, this.latSeconds, this.latDirection);
          this.longDecimalDegrees = this.degreesMinsSecsToDecimal(this.longDegrees, this.longMinutes, this.longSeconds, this.longDirection);
         
      }

      degreesMinsSecsToDecimal(degrees,minutes,seconds,direction) {
      
        var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
      }

      
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

        //this.latDecimalDegrees = 38.162206;
       
      }

      
      render() {
        return html`
        <style>
        </style>
   
        <paper-dialog id="dialog">
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
                background: blue;
                padding: 15px 25px;
                display: inline-block;
                color: white;
              }
              google-map {
                 height: 200px;
                 width: 300px;
              }
             </style>
            <h2>Please find your location using one of the options below:</h2>
         <form>
            <div class="groupBox">
              <h3>Degrees Minutes Seconds</h3>

              <p> Latitude: </p>
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
                    <option value="N" >North</option>
                    <option value="S">South</option>
                    <option value="E">East</option>
                    <option value="W">West</option>
                  </select>
                </div>
              </div>

              <p> Longitude: </p>
              <div class="degminsec">
                <div>
                <label for="degrees">Degrees:</label><input type="text" name="long-degrees" .value="${this.longDegrees}"><br>
                </div>
                <div>
                <label for="minutes">Minutes:</label><input type="text" name="long-minutes" .value="${this.longMinutes}">
                </div>
                <div>
                <label for="seconds">Seconds:</label><input type="text" name="long-seconds" .value="${this.longSeconds}">
                </div>
                <div>
                <label for="direction">Direction:</label>
                  <select id="long-direction">
                    <option value="N">North</option>
                    <option value="S">South</option>
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
                <h3>Decimal Degrees</h3>
                <div class="degminsec">
                  <div>
                    <label for="degrees">Latitude:</label><input type="text" name="dec-lat-degrees" .value="${this.latDecimalDegrees}"><br>
                  </div>
                  <div>
                    <label for="degrees">Logitude:</label><input type="text" name="dec-long-degrees" .value="${this.longDecimalDegrees}">
                  </div>
                </div>
              </div>
              
                        
         </form>

       </paper-dialog>
      `;
      }

      firstUpdated(changedProperties) {
        console.log("firstUpdated called")
        let dialog = this.shadowRoot.getElementById("dialog")
        if (this.shown == "true")
        {
           // this.$.dialog.open();
           dialog.open()
        }

        dialog.addEventListener('iron-overlay-closed', function(e){
            if (e.target === dialog) {
              alert('dialog closed!');
            }
            console.log("dialog trying to close")
          });

      }

      updated(changedProperties){
          console.log("updated called")
      }

    
    }
    
    customElements.define("lat-long-chooser", LatLongChooser);