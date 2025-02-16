<section>
  <div class="form-container">
    <h2>Ajouter une destination</h2>
    <form id="destination-form" novalidate>
      <div class="form-row">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input type="text" id="nom" placeholder="Paris" required />
        </div>
        <div class="form-group">
          <label for="pays">Pays</label>
          <input type="text" id="pays" placeholder="France" required />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            placeholder="Décrivez la destination"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="attractions">Attractions</label>
          <input
            type="text"
            id="attractions"
            placeholder="Tour Eiffel, Louvre"
            required
          />
        </div>
        <div class="form-group">
          <label for="budget_estime">Budget</label>
          <input
            type="number"
            id="budget_estime"
            placeholder="1200"
            required
            min="0"
          />
        </div>
      </div>
      <div class="form-group">
        <button type="submit">Ajouter</button>
      </div>
    </form>
    <div id="message" class="message"></div>
  </div>
</section>;

document
  .getElementById("destination-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs
    const nom = document.getElementById("nom").value.trim();
    const pays = document.getElementById("pays").value.trim();
    const description = document.getElementById("description").value.trim();
    const attractions = document
      .getElementById("attractions")
      .value.split(",")
      .map((a) => a.trim());
    const budgetEstimeInput = document.getElementById("budget_estime");
    const budget_estime = parseFloat(budgetEstimeInput.value);

    // Vérifier que le budget est un nombre valide
    if (isNaN(budget_estime) || budget_estime < 0) {
      document.getElementById("message").textContent =
        "Veuillez entrer un budget valide.";
      document.getElementById("message").className = "message error";
      return;
    }

    // Préparer les données à envoyer
    const data = {
      nom,
      pays,
      description,
      attractions,
      budget_estime,
    };

    // Envoyer les données au backend
    try {
      const response = await fetch("/adddestination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Afficher un message de succès
        document.getElementById("message").textContent = result.message;
        document.getElementById("message").className = "message success";

        // Réinitialiser le formulaire
        event.target.reset();
      } else {
        // Afficher un message d'erreur
        document.getElementById("message").textContent =
          result.message || "Erreur lors de l'ajout de la destination";
        document.getElementById("message").className = "message error";
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      document.getElementById("message").textContent =
        "Erreur lors de la connexion au serveur";
      document.getElementById("message").className = "message error";
    }
  });
