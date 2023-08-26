import { Router } from "@vaadin/router";
import { state } from "../state";

customElements.define(
  "home-page",
  class extends HTMLElement {
    showPets = true;

    connectedCallback() {
      this.render();
      this.userLocation();
      state.subscribe(() => {
        const currentState = state.getState();
        if (currentState.petsAround) {
          if (this.showPets) {
            this.nearbyPets();
          }
        }
      });
    }
    userLocation() {
      const buttonEl = this.querySelector(".button");
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault();
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };

        function success(pos) {
          var crd = pos.coords;
          console.log(crd);
          console.log(crd.latitude);
          console.log(crd.longitude);
          const coordinates = {
            lat: crd.latitude,
            lng: crd.longitude,
          };
          state.petsAround(coordinates);
        }

        function error(err) {
          console.warn("ERROR(" + err.code + "): " + err.message);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
      });
    }
    nearbyPets() {
      const currentState = state.getState();
      const containerEl = this.querySelector(".cards__container-home");
      const petsAround = currentState.petsAround;
      const getUbicationContainer = this.querySelector(".button");
      getUbicationContainer.classList.add("is-hidden");
      if (petsAround.length > 0) {
        for (const pet of petsAround) {
          const cardPet = document.createElement("pet-card");

          cardPet.setAttribute("id", pet.id);
          cardPet.setAttribute("name", pet.name);
          cardPet.setAttribute("pictureUrl", pet.pictureUrl);
          cardPet.setAttribute("zone", pet.zone);
          cardPet.setAttribute("userId", pet.id);
          containerEl.appendChild(cardPet);
        }
      } else {
        const homeP = document.createElement("h3");

        homeP.innerText = "No hay mascotas reportadas cerca tuyo";
        containerEl.appendChild(homeP);
      }
      this.showPets = false;
    }

    render() {
      const styles = document.createElement("style");

      styles.innerHTML = `
     
      .is-hidden{
        display:none;
      }
      p {
        font-size: 1em;
        font-size: 1em;
        text-align: center;
        margin-bottom: 17em;
      }
      .cards__container-home {
        display: block;
        margin: 17%;
       
      }
  
      `;

      this.innerHTML = `
      
      
      
      <nav-bar></nav-bar>


   

              <div class="report">
                    <report-card class="is-hidden"></report-card>
              </div>
              <div class="title">
                     <h2>Mascotas perdidas cerca tuyo</h2>
              </div>
              <div class="ubication-check__container">
              <p>Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</p>
              <button class="button" id="button"> Dar mi ubicacion </button>
              </div> 
            
              <div  class="cards__container-home"></div>
              
  
      
        `;
      this.appendChild(styles);
    }
  }
);
