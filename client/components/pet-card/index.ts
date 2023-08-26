import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "pet-card",
  class extends HTMLElement {
    constructor() {
      super();
    }
    petData = {
      id: "",
      name: "",
      pictureUrl: "",
      zone: "",
      condition: "",
      userId: "",
    };

    type: string;
    connectedCallback() {
      this.type = this.getAttribute("type");
      this.petData.id = this.getAttribute("id");
      this.petData.name = this.getAttribute("name");
      this.petData.pictureUrl = this.getAttribute("pictureUrl");
      this.petData.zone = this.getAttribute("zone");
      this.petData.condition = this.getAttribute("condition");
      this.petData.userId = this.getAttribute("userId");

      this.render();
      this.setReport();
      this.setTypeUser();
    }

    setTypeUser() {
      const cardFooterEl = this.querySelector(".card-footer");
      if (this.type == "user") {
        cardFooterEl.innerHTML = ` <a href="#" class="card-footer-item">Editar</a> `;
        const linkEl = this.querySelector(".card-footer-item");

        linkEl.addEventListener("click", (e) => {
          e.preventDefault();
          state.getPetData(this.petData.id).then(() => {
            Router.go("/edit");
          });
        });
      }
    }

    setReport() {
      const linkEl = this.querySelector(".card-footer-item");

      linkEl.addEventListener("click", (e) => {
        e.preventDefault();
        const currentState = state.getState();
        currentState.reportPetId = this.petData.id;
        state.setState(currentState);
        Router.go("/form-pet");
      });
    }

    render() {
      const styles = document.createElement("style");

      styles.innerHTML = `
      img{
        height: 30%;
        width: 30%;
      }
      .card-image{    
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: white;
        font-size: 20px;
      }
      
      .contenedor-pet-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        
        background: rgba(5, 7, 12, 0.7);
      }
      .card-footer{
        background-color: #6a9eda;
        width: 100%;
        text-align: center;
        color: white;
        font-size: 20px;
        margin-top: 17%;
      }
      .media-content{
        
      }
      `;

      this.innerHTML = `
      <div class="contenedor-pet-card">
        <div class="card-image">
        
          <img src="${this.petData.pictureUrl}"alt="Placeholder image">
          <div class="media-content">
            <p>${this.petData.name}</p>
            <p>${this.petData.zone}</p>
          </div>
        </div>     
        <footer class="card-footer">
            <a class="card-footer-item" id="element">Reportar información</a>
        </footer>
      </div>
        `;
      this.appendChild(styles);
    }
  }
);
