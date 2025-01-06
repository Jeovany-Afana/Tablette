import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js"; // Pour initialiser l'application Firebase
import { getFirestore, collection, onSnapshot, getDocs, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js"; // Pour utiliser Firestore
// Configuration de votre application Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDibbuBJ2p88T26P0BAB-o_exunK0GYFdA", // Clé API de votre projet
  authDomain: "inspecteur-de-classes.firebaseapp.com", // Domaine d'authentification
  projectId: "inspecteur-de-classes", // ID de votre projet
  storageBucket: "inspecteur-de-classes.appspot.com", // Bucket de stockage pour les fichiers
  messagingSenderId: "572661846292", // ID de l'expéditeur de messages
  appId: "1:572661846292:web:aeb0374db2d414fef9f201", // ID de votre application
  measurementId: "G-NVN5GERDV6" // ID de mesure pour les analyses
};

// Initialiser Firebase avec la configuration fournie
const app = initializeApp(firebaseConfig);

// Initialiser Firestore (base de données de Firebase)
const db = getFirestore(app); // Maintenant, Firestore est prêt à être utilisé

//Récupérer les données de la collection "scans" dans Firestore
const scansCollection = collection(db, 'scans');

//Fonction pour afficher les scans dans la table

const afficherTableauEtudiants = (scans) => {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = ""; // Nettoie l'ancien contenu

  scans.forEach((scan) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><i class="fas fa-id-badge mr-2"></i><b>${scan.kairos}</b></td>
      <td><i class="fas fa-user-circle mr-2"></i><b>${scan.pseudoOk.toUpperCase()}</b></td>
      <td style="color:${scan.dureeSolvabilite > 0 ? "green" : "red"};">
        <i class="fas fa-wallet mr-2"></i>${scan.dureeSolvabilite}
      </td>
      <td><i class="fas fa-chalkboard mr-2"></i>${scan.classe}</td>
      <td class="${scan.a_jour ? "up-to-date" : "not-up-to-date"}">
        ${scan.a_jour ? '<i class="fas fa-check-circle text-green-500"></i> À jour' : '<i class="fas fa-times-circle text-red-500"></i> Pas à jour'}
      </td>
      <td><i class="fas fa-calendar-alt mr-2"></i>${scan.date}</td>
      <td style="color:${scan.derogation ? "blue" : "gray"}; font-weight: bold;">
        ${scan.derogation 
          ? '<i class="fas fa-check-circle text-blue-500"></i>     ' + scan.derogationDate  + ' '
          : '<i class="fas fa-times-circle text-gray-500"></i> Pas de dérogation'}
      </td>
    `;

    tableBody.appendChild(row);
  });
};


// Requête pour récupérer les scans triés
const orderedScansQuery = query(scansCollection, orderBy("timestamp", "desc"));

// Écoute en temps réel
onSnapshot(orderedScansQuery, (snapshot) => {
  const scans = [];
  snapshot.forEach((doc) => {
    scans.push(doc.data());
  });

  afficherTableauEtudiants(scans);
});

async function clearFirestoreCollection() {
  const collectionName = "scans"; // Remplace par le nom de ta collection
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    if (querySnapshot.empty) {
      alert("La collection est déjà vide !");
      return;
    }

    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, collectionName, document.id))
    );

    await Promise.all(deletePromises);
    alert(`Tous les documents de la collection '${collectionName}' ont été supprimés.`);
  } catch (error) {
    console.error("Erreur lors de la suppression des documents :", error);
    alert("Une erreur est survenue. Vérifie la console pour plus de détails.");
  }
}

document.querySelector(".delete-button").addEventListener("click", function(){clearFirestoreCollection()});







