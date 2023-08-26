import { state } from "../state";

customElements.define(
  "pets-page",
  class extends HTMLElement {
    connectedCallback() {
      state.getMyPets();
      this.render();
      state.subscribe(() => {
        this.getUserPets();
      });
    }
    //obtiene las mascotas reportadas del usuario
    getUserPets() {
      const currentState = state.getState();
      const containerEl = this.querySelector(".cards__container");
      const userPets = currentState.userPets;
      if (userPets.length > 0) {
        for (const pet of userPets) {
          const cardEl = document.createElement("pet-card");
          cardEl.setAttribute("type", "user");
          cardEl.setAttribute("id", pet.id);
          cardEl.setAttribute("name", pet.name);
          cardEl.setAttribute("pictureUrl", pet.pictureUrl);
          cardEl.setAttribute("zone", pet.zone);
          cardEl.setAttribute("condition", pet.condition);
          cardEl.setAttribute("userId", pet.id);
          containerEl.appendChild(cardEl);
        }
      }
    }

    render() {
      const containerEl = document.createElement("div");
      const styles = document.createElement("style");

      styles.innerHTML = `
      .cards__container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 16px;
      }
     
      }
     
     
        `;

      this.innerHTML = `
      
    
        <nav-bar ></nav-bar>
        
      <div class="main__container">
        <h2>Mis mascotas reportadas</h2>
          <div class="cards__container ">
          </div>
       </div>
    
    
        
          `;
      this.appendChild(styles);
    }
  }
);
