
async function checkSession() {
  try {
    const response = await fetch("/check-session");
    const data = await response.json();

    if (data.isLoggedIn) {

      document.getElementById("username").textContent = data.user.pseudo;
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      window.location.href = "./login.html";
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la session :", error);
  }
}

// Fonction pour gérer la déconnexion
async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
    });

    if (response.ok) {
      // Rediriger vers la page de connexion après la déconnexion
      window.location.href = "./login.html";
    } else {
      console.error("Erreur lors de la déconnexion");
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
}

// Événement pour le bouton de déconnexion
document.getElementById("logout-button").addEventListener("click", logout);

// Vérifier la session au chargement de la page
checkSession();
