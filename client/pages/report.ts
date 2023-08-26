import { state } from "../state";
import Dropzone from "dropzone";
import { Router } from "@vaadin/router";

customElements.define(
  "report-page",
  class extends HTMLElement {
    pictureUrl = "";
    connectedCallback() {
      this.render();
      this.petReport();
      this.petCancel();
    }
    petReport() {
      const form = this.querySelector(".form");
      const dropEl = this.querySelector(".foto-input");
      const previewContainer = this.querySelector(".dropzone-previews");
      const myDropzone = new Dropzone(dropEl, {
        url: "/falsa",
        autoProcessQueue: false,
        addRemoveLinks: true,
        createImageThumbnails: true,
        thumbnailMethod: "crop",
        previewsContainer: previewContainer,
        thumbnailHeight: 50,
      });
      let picture;
      myDropzone.on("thumbnail", function (file) {
        picture = file;
      });
      form.addEventListener("submit", (e) => {
        const currentState = state.getState();
        const target = e.target as any;
        e.preventDefault();
        const petData = {
          name: target.name.value,
          lat: currentState.coordinates.lat,
          lng: currentState.coordinates.lng,
          pictureUrl: picture.dataURL,
          zone: currentState.petZone,
        };
        state.createPet(petData).then(() => {
          Router.go("/user-pets");
        });
      });
    }
    petCancel() {
      const buttonEl = this.querySelector(".cancel-button");
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/");
      });
    }

    render() {
      const styles = document.createElement("style");
      styles.innerHTML = `
      .container {
       
        height: 90vh;
        width: 40%;
      }
      input{
        
        margin-bottom: 1em;
        width: 100%;
        border-bottom: 2px solid var(--transp-white-1);
   
       }
       @media screen and (max-width: 800px) {
        .container {
       
          height: 90vh;
          width: 100%;
        }
       }
    
              `;

      this.innerHTML = `
              
        <nav-bar></nav-bar>
      <div class="wrapper">
        <div class="container ">
                <div class="main__container">
                   <h2>Reportar mascota perdida</h2>
                 <form class="form ">              
                 <input class="input name" placeholder="Nombre" type="text" name="name"/>
                   <figure class="dropzone-previews image is-121x47 ">                   
                    </figure>                                             
                    <button class="button   foto-input" id="pic_button" type="button">Agregar/Modificar foto</button>                                           
              <div class="control">
              <map-el></map-el>              
              </div>              
            <div class="control">
            <button class="button ">Reportar como perdido</button>        
            </div>
              <div class="control">
              <button class="button  cancel-button" type="button">Cancelar</button>
            </div>
            </form>
            </div>
           </div>
           </div>
       
                `;

      this.appendChild(styles);
    }
  }
);
