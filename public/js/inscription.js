document
  .getElementById("sign-up")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const pseudo = document.getElementById("register-username").value.trim();
    const usermail = document.getElementById("register-email").value.trim();
    const userpassword = document
      .getElementById("register-password")
      .value.trim();

    // Récupérer l'élément pour afficher les messages
    const inner = document.getElementById("inner");

    // Vérifier si l'email est vide
    if (!usermail) {
      inner.innerHTML = "Le champ email est vide.";
      inner.style.backgroundColor = "#f44336"; // Rouge
      inner.style.color = "#fff";
      inner.style.display = "block";
      return;
    }

    // Vérifier la validité de l'email
    if (!usermail.includes("@") || !usermail.includes(".")) {
      inner.innerHTML = "L'adresse email est invalide.";
      inner.style.backgroundColor = "#f44336"; // Rouge
      inner.style.color = "#fff";
      inner.style.display = "block";
      return;
    }

    // Vérifier si le mot de passe est vide
    if (!userpassword) {
      inner.innerHTML = "Le champ mot de passe est vide.";
      inner.style.backgroundColor = "#f44336"; // Rouge
      inner.style.color = "#fff";
      inner.style.display = "block";
      return;
    }

    // Vérifier si le pseudo est vide
    if (!pseudo) {
      inner.innerHTML = "Le champ pseudo est vide.";
      inner.style.backgroundColor = "#f44336"; // Rouge
      inner.style.color = "#fff";
      inner.style.display = "block";
      return;
    }

    try {
      // Envoyer une requête POST au serveur
      const response = await fetch("/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudo,
          usermail,
          userpassword,
          // preferences,
          // historique_voyages,
        }),
      });

      // Vérifier si la réponse est OK
      if (response.ok) {
        inner.textContent = "Compte créé avec succès !";
        inner.style.backgroundColor = "#4caf50"; // Vert
        inner.style.color = "#fff";
        inner.style.display = "block";

        // Afficher une alerte et rediriger après 1 seconde
        alert(
          "Votre compte a été créé. Patientez quelques secondes, vous serez redirigé."
        );
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 1000);
      } else {
        // Gérer les erreurs spécifiques du serveur
        const errorData = await response.json();
        inner.textContent =
          errorData.message || "Erreur lors de la création du compte.";
        inner.style.backgroundColor = "#f44336"; // Rouge
        inner.style.color = "#fff";
        inner.style.display = "block";
      }
    } catch (error) {
      // Gérer les erreurs réseau ou autres
      inner.textContent = "Erreur lors de la requête. Veuillez réessayer.";
      inner.style.backgroundColor = "#f44336"; // Rouge
      inner.style.color = "#fff";
      inner.style.display = "block";
      console.error("Erreur lors de la requête :", error);
    }
  });
