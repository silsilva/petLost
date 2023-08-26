import { Router } from "@vaadin/router";
import { state } from "../state";

customElements.define(
  "edit-me",
  class extends HTMLElement {
    connectedCallback() {
      const currentState = state.getState();
      const token = currentState.authtoken;
      this.render();
      this.modifyUser();
      this.verifyUser();
      state.subscribe(() => {
        this.setUserData();
      });
    }

    async verifyUser() {
      const currentState = state.getState();
      if (currentState.authtoken.token) {
        const userData = await state.myInfo();
        currentState.userData = userData;
        state.setState(currentState);
      }
    }

    setUserData() {
      const currentState = state.getState();
      if (currentState.userData) {
        const nombre = this.querySelector(".name");
        nombre.setAttribute("placeholder", currentState.userData.name);
      }
    }

    modifyUser() {
      const formEl = this.querySelector(".form");

      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        if (target.password.value === target.repeatPassword.value) {
          const userData = {
            name: target.name.value,
            password: target.password.value,
          };

          state.editMyInfo(userData).then((res) => {
            Router.go("/");
          });
        }
        if (target.password.value != target.repeatPassword.value) {
          alert("no coinciden");
        }
      });
    }

    render() {
      const styles = document.createElement("style");

      styles.innerHTML = `
      input{
   
        border-bottom: 2px solid var(--transp-white-1);
        margin-bottom: 2em;
       }
             
            `;

      this.innerHTML = `
          
      <nav-bar></nav-bar>

      <div class="wrapper">
        <div class="container ">
          <h2>Mis Datos</h2>
          <form class="form">
              <div class="search-container">
                    
                   <input class="input name" placeholder="Nombre" type="text" name="name"/>
                   <input class="input password" placeholder="Contraseña" type="password" name="password"/>  
                   <input class="input password" placeholder="Repetir contraseña"  type="password"  name="repeatPassword"/>                      
                    <button class="button" id="search-btn">Enviar</button>
              </div>
          </form>
        </div>
      </div>
         
              `;
      this.appendChild(styles);
    }
  }
);
