import { Router } from "@vaadin/router";
import { state } from "../state";
import { log } from "console";

customElements.define(
  "form-page",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      this.reportCard();
    }
    reportCard() {
      const deleteButtonEl = this.querySelector(".delete");
      deleteButtonEl.addEventListener("click", (e) => {
        const currentState = state.getState();
        currentState.showReport = false;
        state.setState(currentState);
      });
    }

    render() {
      const styles = document.createElement("style");

      styles.innerHTML = `
      input{
   
        border-bottom: 2px solid var(--transp-white-1);
        
       }
       .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90vh;

      }
      #button {
        height: 3em;
        width: 40%;
        margin-left: 30%;
        border-radius: 0.6em;
        background: var(--of-white);
      }
          
              `;

      this.innerHTML = `
      <nav-bar></nav-bar>
       
    <div class="wrapper" id="wrapper">
        <div class="container ">
                <h2>envie su formulario</h2>
          <form  class="form" id="form" action="https://formsubmit.co/25e63fc29c62fe415cf2c22e563215c3" method="POST">
            <div class="search-container">
                <label for="Nombre">Nombre</label>
                <input type="text" name="name">
                <label for="Email">Email</label>
                <input type="email" name="email">
                <label for="subject">Asunto</label>
                <input type="text" name="subject">
                <label for="comments">Comentarios</label>
                 <textarea name="comments" cols="15" rows="5"></textarea>
                <input type="submit" id="button" value="Enviar">
                <input type="hidden" name="_next" value="https://petlost.onrender.com">
                <input type="hidden" name="_captcha" value="false">
             
            </div>
          </form>
        </div>
           
    </div>
          
         
                `;

      this.appendChild(styles);
    }
  }
);
