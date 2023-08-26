import { state } from "../state";
import Dropzone from "dropzone";
import { Router } from "@vaadin/router";

customElements.define(
  "edit-page",
  class extends HTMLElement {
    petData = state.data.petData;

    connectedCallback() {
      const currentState = state.getState();
      this.petData = currentState.petData;
      this.render();
      this.modifyPet();
      this.deletePet();

      state.subscribe(() => {
        const currentState = state.getState();
        this.petData = currentState.petData;
      });
    }
    modifyPet() {
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
      let picture = {
        dataURL: "",
      };
      myDropzone.on("thumbnail", function (file) {
        picture = file;
      });

      form.addEventListener("submit", (e) => {
        const target = e.target as any;
        e.preventDefault();

        let petData = this.petData;

        if (target.name.value) {
          petData = {
            ...petData,
            name: target.name.value,
          };
        }
        if (picture.dataURL) {
          petData = {
            ...petData,
            pictureUrl: picture.dataURL,
            newPicture: true,
          };
        }

        state.editPet(petData).then(() => {
          Router.go("/user-pets");
        });
      });
    }
    deletePet() {
      const form2 = this.querySelector(".borrar");
      form2.addEventListener("click", (e) => {
        e.preventDefault();

        state.deletePet(parseInt(this.petData.id));
        alert("mascota eliminada");
        Router.go("/user-pets");
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
        <div class="container">
            <h2>Editar mascota perdida</h2>
          <form class="form">           
                <label class="label ">Nombre</label>
                  <div class="control">
                      <input class="input"  type="text" name="name" placeholder="${this.petData.name}"/>
                  </div>          
                <div class="control">
                  <figure class="dropzone-previews image is-121x47 ">
                  <img src=${this.petData.pictureUrl} width="360px" height="350px">
                  </figure>
                </div>
        
                <div class="control ">
                   <button  id="button" class="button is-medium is-primary is-fullwidth foto-input" id="pic_button" type="button">Agregar/Modificar foto</button>
               </div>
                <div class="control">
                  <map-el lat=${this.petData.lat} lng=${this.petData.lng} zone=${this.petData.zone}></map-el>
                </div>
              <div class="control">
                <button id="button" class="guardar">Guardar</button>
              </div>      
                <button id="button" class="borrar">BORRAR</button>    
          </form>
         </div>
    </div>
                `;

      this.appendChild(styles);
    }
  }
);
