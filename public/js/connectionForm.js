document
  .getElementById("signin")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const pseudo = document.getElementById("login-username").value.trim();
    const userpassword = document.getElementById("login-password").value.trim();

    console.log("Données envoyées :", { pseudo, userpassword }); // Afficher les données

    try {
      const response = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudo,
          userpassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Réponse du serveur :", data);
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Erreur du serveur :", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  });
