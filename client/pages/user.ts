import { Router } from "@vaadin/router";
import { state } from "../state";

customElements.define(
  "user-page",
  class extends HTMLElement {
    connectedCallback() {
      const currentState = state.getState();
      const token = currentState.authtoken;
      this.render();
      this.setForm();
    }
    setForm() {
      const formEl = this.querySelector(".form");
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        if (
          target.password.value === target.repeatPassword.value &&
          target.password.value != ""
        ) {
          const userData = {
            name: target.name.value,
            password: target.password.value,
          };
          state.signUp(userData).then((res) => {
            state.signIn(target.password.value);
            if (res.id) {
              Router.go("/");
            } else {
              alert("ups algo salio mal");
              console.log(res);
            }
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
