import { Router } from "@vaadin/router";
import { state } from "../state";

customElements.define(
  "login-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      this.checkEmail();
    }

    checkEmail() {
      const formEl = this.querySelector(".form");
      formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        const target = e.target as any;
        const currentState = state.getState();
        currentState.userEmail = target.email.value;
        state.setState(currentState);
        const checked = await state.authUser(target.email.value);
        if (checked.user === true) {
          Router.go("/password");
        } else {
          Router.go("/user-data");
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
        <div class="container">
                    <h2>Ingresar</h2>
        <form class="form">
              <div class="search-container">
                  <input type="email" placeholder="Email" id="email"/>
                  <button  id="search-btn">Enviar</button>
              </div>
        </form>
        </div>
    </div>
     
          `;
      this.appendChild(styles);
    }
  }
);
