import { Router } from "@vaadin/router";
import { state } from "../state";
import { log } from "console";

customElements.define(
  "password-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      this.setForm();
    }
    setForm() {
      const form = this.querySelector(".form");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const target = e.target as any;
        const currentState = state.getState();
        const login = await state.signIn(target.password.value);
        if (login) {
          Router.go("/");
        }
        if (currentState.authtoken === false) {
          alert("password incorrecto");
        }
      });
    }
    render() {
      const styles = document.createElement("style");

      styles.innerHTML = `
      input{
        margin-bottom: 7em;
        border-bottom: 2px solid var(--transp-white-1);
       }
       
          `;

      this.innerHTML = `
          
      <nav-bar></nav-bar>

      <div class="wrapper">
        <div class="container ">
          <h2>Password</h2>
          <form class="form">
              <div class="search-container">
                    
                  
                   <input class="input password" placeholder="Contraseña" type="password" name="password"/>  
                                         
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
