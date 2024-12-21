function accueil(){
    window.location.href = 'index.html';
    localStorage.clear();
}

function ouvrirInscription() {
    window.location.href = 'inscription.html'; // Ouvre la page d'inscription
}

function ouvrirConnexion() {
    window.location.href = 'connexion.html'; // Ouvre la page d'inscription
}

function ouvrirInfos() {
    window.location.href = 'information.html'; // Ouvre la page d'inscription
}

function createWatchlist() {
    window.location.href = 'create_watchlist.html';
}

function findTitle() {
    window.location.href = 'find_title.html';
}

async function connexion() {
    const email = document.getElementById("connexionMail").value;
    const passeword = document.getElementById("connexionPwd").value;

    
    const response = await fetch('https://stream-smart-groupe-28.onrender.com/api/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  
            email, 
            password:passeword
         })
    });

    if (!response.ok) {
        const errorData = await response.json();
        alert("Erreur lors de la connexion");
    } else {
        const result = await response.json();
        const code=result.status_code
        if (code===200) {
            alert(result.detail);  // Affiche le message "Connexion réussie"
            window.location.href = 'page_connexion.html';
            localStorage.setItem('token', result.token);

    } else{
        alert(result.detail);
    }
    
    }
    
}



async function Inscription() {
    const pseudo = document.getElementById("inscriptionPseudo").value;
    const email = document.getElementById("inscriptionMail").value;
    const passeword = document.getElementById("inscriptionPwd").value;
    const code_pays = document.getElementById("inscriptionPays").value;

    const response = await fetch('https://stream-smart-groupe-28.onrender.com/api/inscription/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            pseudo, 
            email, 
            pwd:passeword, 
            code_pays
         })
    });

    if (!response.ok) {
        alert("Erreur lors de l'inscription");
    } else {
        const result = await response.json();
        const status_code=result.code
        if (status_code===200) {
            alert(result.message);  // Affiche le message "Utilisateur ajouté"
            window.location.href = 'connexion.html'; // Ouvre la page de connexion
        } else {
            alert(result.message); 
            window.location.href = 'connexion.html'; // Ouvre la page de connexion
        }
    }
}




async function searchContent() {
    const contentName = document.getElementById('contentTitle').value;
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/content/search/${contentName}`;
    if (contentName) {
        const response = await fetch(baseUrl)
        if (!response.ok) {
            alert("Erreur lors de la recherche");
        } else {
            const contents = await response.json();
            const contentContainer = document.getElementById('contentContainer');
            if (contents.length == 0){
                contentContainer.innerHTML = 'Aucun contenu trouvé';
            } else{
            contentContainer.innerHTML = ''; // Réinitialiser le conteneur
            const Resultats = document.createElement('h2');
            Resultats.textContent="Résultats de la recherche";
            contentContainer.appendChild(Resultats);
            contents.forEach(content => {
                // Créer un label pour le titre du content
                const contentLabel = document.createElement('label');
                contentLabel.textContent = content.titre;
                // Créer un bouton pour voir le content
                const viewButton = document.createElement('button');
                viewButton.className="button2";
                viewButton.textContent = 'Voir plus';
                viewButton.onclick= () => { 
                    window.location.href = `voir_plus.html?contentId=${content.id}`;
                };
    
                // Ajouter les éléments au conteneur
                contentContainer.appendChild(contentLabel);
                contentContainer.appendChild(viewButton);
                contentContainer.appendChild(document.createElement('br')); // Ajouter un espace entre les contents
            });
            }
        }

            

    } else{
        const contentContainer = document.getElementById('contentContainer');
        contentContainer.innerHTML = 'Aucun contenu trouvé';
    }           
}





async function creer_watchlist(){
    let id_user=localStorage.getItem('token');
    let nomWatchlist = document.getElementById("nomWatchlist").value;
    if (nomWatchlist){
    const reponse = await fetch(`https://stream-smart-groupe-28.onrender.com/watchlist/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nom":nomWatchlist,
            "id_user":id_user
         })
    });

    if (!reponse.ok) {
        alert("Erreur lors de la creation de la watchlist");
    } else {
        const result = await reponse.json();
        const status_code=result.code;
        if (status_code===200) {
            alert(result.message);  // Affiche le message 
            window.location.href = 'my_watchlists.html'; // Ouvre la page de connexion
        } else {
            alert(result.message); 
        }
    }
    }
}



window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('contentId');

    if (contentId) {
        getContentDetails(contentId);
    }
};


async function getContentDetails(contentId) {
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/contentId/${contentId}`;
    const response = await fetch(baseUrl);
    if (!response.ok) {
        alert("Erreur lors du chargement du contenu");
    } else {
        const result = await response.json();
        displayContentDetails(result);
    }

    
    }



async function displayContentDetails(result) {
    const contentDetailsContainer = document.getElementById('contentDetails');
    
    // Affichage des détails du contenu
    const titre = document.createElement('h2');
    titre.textContent = result.titre;

    const description = document.createElement('p');
    description.textContent = result.synopsis;

    const genre = document.createElement('p');
    if(result.genre.length==0){
        genre.textContent = `Genre(s) : Introuvable`;
    } else{
        genre.textContent = `Genre(s) : ${result.genre}`;
    }

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Date de sortie: ${result.date_sortie}`;

    const notes = document.createElement('h3');
    notes.textContent = `notes: ${result.notes}`;

    const addWatchButton = document.createElement('button');
    addWatchButton.className="button2";
    addWatchButton.textContent = 'Ajouter dans une watchlist';
    addWatchButton.onclick= () => { 
        window.location.href = `ajout_watch.html?contentId=${result.id}`;
    };

    const platButton = document.createElement('button');
    platButton.className="button2";
    platButton.textContent = 'Voir les plateformes';
    platButton.onclick= () => { 
        window.location.href = `see_platform.html?contentId=${result.id}`;
    };



    const img = document.createElement('img');
    if(result.img){
    img.src =   result.img;
    img.alt = 'Affiche du film';  // Description alternative
    img.title = 'Photo du film';  // Texte au survol de l'image
    img.width = 200;  // Largeur de l'image en pixels
    img.height = 150;
    } else{
        img.alt = 'Introuvable';  // Description alternative
        img.title = 'Introuvable';
    }

    contentDetailsContainer.appendChild(img);
    contentDetailsContainer.appendChild(titre);
    contentDetailsContainer.appendChild(description);
    contentDetailsContainer.appendChild(releaseDate);
    contentDetailsContainer.appendChild(genre);
    contentDetailsContainer.appendChild(notes);
    contentDetailsContainer.appendChild(addWatchButton);
    contentDetailsContainer.appendChild(platButton);
    contentDetailsContainer.appendChild(document.createElement('br'));
}


async function afficher_watchlist(){
    let id_user=localStorage.getItem('token');
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/user/view/watchlists/${id_user}`;
    const response = await fetch(baseUrl);
    if (!response.ok) {
        alert("Erreur lors du chargement des contenus");
    } else {
        const result = await response.json();
        const watchs=document.getElementById("les_watchlists");
        if (result.length == 0){
            watchs.innerHTML='Aucune watchlist créée';
        } else {
            watchs.innerHTML='';
            result.forEach(watch => {
                // Créer un label pour le nom de la watchlist
                const watchLabel = document.createElement('label');
                watchLabel.textContent = watch.nom;

                const watchDate = document.createElement('label');
                watchDate.textContent = `Créée le: ${watch.date_creation}`;

                // Créer un bouton pour voir le content
                const consButton = document.createElement('button');
                consButton.className="button2";
                consButton.textContent = 'Consulter';
                consButton.onclick= () => { 
                    window.location.href = `voir_watch.html?watchId=${watch.id_watchlist}`;
                };

                const suppButton = document.createElement('button');
                suppButton.className="button2";
                suppButton.textContent = 'Supprimer';
                suppButton.onclick= () => {
                    if (confirm("Attention, action irréversible ! Êtes-vous sûr de vouloir supprimer ?")){
                        supprimer_watchlist(watch.id_watchlist);
                    }
                };

                const platButton = document.createElement('button');
                platButton.className="button2";
                platButton.textContent = 'Meilleur abonnement';
                platButton.onclick= () => { 
                    window.location.href = `best_platform.html?watchId=${watch.id_watchlist}`;
                };
    
                // Ajouter les éléments au conteneur
                watchs.appendChild(watchLabel);
                watchs.appendChild(watchDate);
                watchs.appendChild(consButton);
                watchs.appendChild(suppButton);
                watchs.appendChild(platButton);
                watchs.appendChild(document.createElement('br')); // Ajouter un espace entre les contents
            });
        }
        
    }

}



window.addEventListener('load', afficher_watchlist);
window.addEventListener('load', function(){
    const urlParams = new URLSearchParams(window.location.search);
    const watchId = urlParams.get('watchId');

    if (watchId) {
        getwatchDetails(watchId);
    }
});


async function getwatchDetails(watchId) {
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/watchlist/view/${watchId}`;
    const response = await fetch(baseUrl);
    if (!response.ok) {
        alert("Erreur lors du chargement des contenus");
    } else {
        const result = await response.json();
        const watchDetails=document.getElementById("watchDetails");
        watchDetails.innerHTML='';
        if (result.length == 0){
            watchDetails.innerHTML='Aucun contenu dans la watchlist';
        }
        else{
            result.forEach(content => {
            displayContent(content);
        });
        
    }

    
}
}

async function displayContent(result) {
    const contentDetails = document.getElementById('watchDetails');
    
    // Affichage des détails du contenu
    const titre = document.createElement('h2');
    titre.textContent = result.titre;

    const description = document.createElement('p');
    description.textContent = result.synopsis;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Date de sortie: ${result.date_sortie}`;

    const notes = document.createElement('h3');
    notes.textContent = `notes: ${result.notes}`;

    const genre = document.createElement('p');
    if (result.genre.length==0){
        genre.textContent = `Genres(s): Introuvable`;
    } else {
        genre.textContent = `Genre(s) : ${result.genre}`;   
    }

    const platButton = document.createElement('button');
    platButton.className="button2";
    platButton.textContent = 'Voir les plateformes';
    platButton.onclick= () => { 
        window.location.href = `see_platform.html?contentId=${result.id}`;
    };


    const effacer = document.createElement('button');
    effacer.className="button2";
    effacer.textContent = 'Supprimer de la watchlist';
    effacer.onclick= () => { 
        effacer_contenu_de_watchlist(result.id);
    };

    const img = document.createElement('img');
    if (result.img){
    img.src =   result.img;
    img.alt = 'Affiche du film';  
    img.title = 'Photo du film';  // Texte au survol de l'image
    img.width = 200;  // Largeur de l'image en pixels
    img.height = 150;
    } else{
        img.alt = 'Image introuvable'; 
        img.title = 'Introuvable';
    }

    contentDetails.appendChild(img);
    contentDetails.appendChild(titre);
    contentDetails.appendChild(description);
    contentDetails.appendChild(releaseDate);
    contentDetails.appendChild(genre);
    contentDetails.appendChild(notes);
    contentDetails.appendChild(platButton);
    contentDetails.appendChild(effacer);
    contentDetails.appendChild(document.createElement('br'));
    contentDetails.appendChild(document.createElement('br'));
}


async function effacer_contenu_de_watchlist(id_content){
    const urlParams = new URLSearchParams(window.location.search);
    const watchId = urlParams.get('watchId');
    if (watchId){
        if (confirm("Attention, action irréversible ! Êtes-vous sûr de vouloir supprimer ce contenu ?")){
            const response = await fetch(`https://stream-smart-groupe-28.onrender.com/watchlist/delete/content/${watchId}/${id_content}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert("Erreur lors de la suppression");
            } else {
                const result = await response.json();
                const code=result.code
                if (code===200) {
                    alert(result.message);  
                    window.location.href = `voir_watch.html?watchId=${watchId}`;
    
            } else{
                alert(result.message);
            }
            
            }
            
        }
    }
}

async function supprimer_watchlist(id_watchlist) {
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/watchlist/delete/${id_watchlist}`;
    const response = await fetch(baseUrl,{
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json', // Optionnel, selon la route
          // Ajoute d'autres headers si nécessaire, par exemple pour l'authentification
          // 'Authorization': 'Bearer <token>'
        },
      });

    if (!response.ok) {
        alert("Erreur lors de la suppression de la watchlist");
    } else {
        const result = await response.json();
        if (result.code == 200){
            alert(result.message);
            window.location.href = "my_watchlists.html";
        }
        else{
            alert(result.message);
    }

    
}
}





async function getwatchPlat(watchId){
    const critere=document.getElementById("critere");
    const critere_choix=critere.value;
    if (critere_choix){
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/watchlist/best_platform/${watchId}/${critere_choix}`;
    const response = await fetch(baseUrl);
    if (!response.ok) {
        alert("Erreur lors du chargement de la plateforme");
    } else {
        const result = await response.json();
        const platDetails=document.getElementById("plaformDetails");
        platDetails.innerHTML='';
        if (result.length == 0){
            platDetails.innerHTML='Aucune platforme trouvé ou watchlist vide';
        }
        else{
            // Affichage des détails du contenu
            const nom = document.createElement('h2');
            nom.textContent = result.nom_platform;

            const lien = document.createElement('a');
            lien.href = result.lien;
            console.log(result.lien);
            lien.textContent="Visiter le site";

            const prix = document.createElement('label');
            prix.textContent = `Abonnement mensuel: ${result.prix}`;

            platDetails.appendChild(nom);
            platDetails.appendChild(lien);
            platDetails.appendChild(document.createElement('br'));
            platDetails.appendChild(document.createElement('br'));
            platDetails.appendChild(prix);
        
    }

    
}
}
}


async function liste_watch() {
    let id_user=localStorage.getItem('token');
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/user/view/watchlists/${id_user}`;
    const response = await fetch(baseUrl);
    if (!response.ok) {
        alert("Erreur lors du chargement des contenus");
    } else {
        const result = await response.json();
        const selectElement=document.getElementById("mes_watchs");
        if (result.length == 0){
            selectElement.innerHTML = '<option value="">Aucune watchlist créée</option>';
        } else {
            const choisir = document.createElement('option');
            choisir.textContent="Choisir une watchlist";
            choisir.value="";
            selectElement.appendChild(choisir);
            result.forEach(watch => {
                const valeur = document.createElement('option');
                valeur.textContent=watch.nom;
                valeur.value=watch.id_watchlist;
                selectElement.appendChild(valeur);  
            });
        }
        
    }


}

window.addEventListener('load', liste_watch);

const best_plat=document.getElementById('best_plat');
if (best_plat){
    best_plat.addEventListener('click',function(){
        const urlParams = new URLSearchParams(window.location.search);
        const watchId = urlParams.get('watchId');
        if (watchId) {
            getwatchPlat(watchId);
        }  
    });
}

const ajout=document.getElementById('ajout_content_watch');
if(ajout){
    ajout.addEventListener('click',function(){
        const urlParams = new URLSearchParams(window.location.search);
        const watchId = document.getElementById("mes_watchs").value;
        const contentId=urlParams.get('contentId');
        if (watchId){
        ajouter_content_watchlist(watchId,contentId);
        }
    });
}

async function ajouter_content_watchlist(watchId,contentId) {
    const response = await fetch('https://stream-smart-groupe-28.onrender.com/watchlist/add/content/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "id_watchlist":watchId,
            "id_content":contentId
         })
    });

    if (!response.ok) {
        alert("Erreur lors de l'ajout du contenu dans une watchlist");
    } else {
        const result = await response.json();
        const status_code=result.code
        if (status_code===200) {
            alert(result.message); 
            window.location.href = 'my_watchlists.html'; // Ouvre la page des watchlists
        } else {
            alert(result.message);
        }
    }
}

window.addEventListener('load', function(){
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('contentId');
    if(contentId){
        getplatform(contentId);
    }
});

async function getplatform(contentId){
    const baseUrl = `https://stream-smart-groupe-28.onrender.com/content/view/platforms/${contentId}`;
    const response = await fetch(baseUrl);
    if (!response.ok) {
        alert("Erreur lors du chargement des plateformes");
    } else {
        const result = await response.json();
        const platformes=document.getElementById("sites_du_film");
        platformes.innerHTML='';
        if (result.length == 0){
            platformes.innerHTML='Aucune plateforme trouvée';
        }
        else{
            result.forEach(platforme => {
            displayPlatform(platforme);
        });
        
    }

    
}
}

async function displayPlatform(platforme) {
    const plateformes = document.getElementById('sites_du_film');
    const section=document.createElement("div");

    const nameElement = document.createElement("p");
    nameElement.textContent = platforme.nom_platform;
    section.appendChild(nameElement);


    const priceElement = document.createElement("p");
    priceElement.textContent = "Abonnement mensuel: " + platforme.prix + " euros";
    section.appendChild(priceElement);

    const linkElement = document.createElement("a");
    linkElement.textContent = "Visiter le site";
    linkElement.href = platforme.lien;
    linkElement.target = "_blank";
    section.appendChild(linkElement);

    plateformes.appendChild(section);
    plateformes.appendChild(document.createElement('br'));
    
}

async function desinscrire() {
    if (confirm("Attention, action irréversible ! Êtes-vous sûr de vouloir vous désinscrire ?")){
        const id_user=localStorage.getItem('token');
        const response = await fetch(`https://stream-smart-groupe-28.onrender.com/api/desinscription/${id_user}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Erreur lors de la désinscription");
        } else {
            const result = await response.json();
            const code=result.code
            if (code===200) {
                alert(result.message);  
                window.location.href = 'accueil/index.html';
                localStorage.removeItem('token');

        } else{
            alert(result.message);
        }
        
        }
        
    }
}
