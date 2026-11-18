# Parc Sport dans la Ville : spécification de construction (v1)

Document de référence pour construire l'application dans VS Code avec un agent de code.
Table 04, eXaltemps Solidaire, novembre 2026. Toutes les données sont fictives.

---

## 0. Comment utiliser ce document

- Ce fichier décrit **la vraie application** : ses écrans, ses parcours, ses règles. Il ne décrit pas une démo.
- **Ne pas construire** de bandeau de scénario, de « démo guidée », de stepper ou de texte qui explique quoi cliquer. L'application doit se suffire à elle-même.
- On garde un **mode maquette** utile pour tester et montrer : un cadre de téléphone affichable à côté du poste de travail, un interrupteur de réseau, un sélecteur de persona au démarrage. Ces trois éléments sont regroupés dans une barre « Outils de test » discrète, masquable.
- Le fichier `index.html` fourni à côté est une **référence visuelle et comportementale**. On reprend son rendu et ses interactions, pas son code.
- En cas de doute, appliquer les règles de la section 3, puis demander.

---

## 1. Problème et objectif

**Problème.** Le directeur national des infrastructures ne peut pas suivre seul les contrôles et les réparations sur 80 terrains. Il n'existe ni canal unique pour remonter un incident ni registre par équipement. Les remontées arrivent par WhatsApp, SMS ou mail, et personne ne vérifie après réparation.

**Objectif v1.** Un RST signale un incident en quelques gestes depuis le terrain, même sans réseau. L'incident est attribué automatiquement à la bonne personne. Il est visible par tous dans une bannette commune et n'est clos qu'après vérification sur place. Chaque équipement a un carnet de santé daté.

**Indicateurs de réussite**
| Hypothèse | Mesure | Cible |
|---|---|---|
| Le RST signale en moins de 3 actions et 30 s après le scan | Part des incidents remontés hors canal (SMS, WhatsApp, mail) | 0 % |
| Le hors ligne ne perd rien | Incidents saisis hors ligne transmis sans perte (test mode avion) | 100 % |
| Le carnet donne un registre complet | Équipements avec historique daté accessible par QR | 100 % |

---

## 2. Périmètre

**Dans la v1**
1. Signalement depuis le terrain : scan QR, 3 champs, photo, urgence
2. Saisie hors ligne et envoi automatique au retour du réseau
3. Attribution automatique et bannettes (ma bannette, commune, pour info)
4. Notifications ciblées selon la gravité (Teams, mail si Danger)
5. Enregistrement de l'intervention, statut « Réparé, à vérifier »
6. Vérification par le RST sur place (OK ou KO, photo « après »)
7. Carnet de santé par équipement
8. Administration simple : terrains, équipements, personnes, règles, QR codes

**Hors v1** (à prévoir dans le modèle, à ne pas construire) : carte de France, alerte récidive, relance automatique après 48 h, gestion des prestataires et des contrats, contrôles planifiés, suivi des jeunes, tableau de bord Power BI. Dans l'interface, ces éléments peuvent apparaître avec une étiquette « V2 » ou ne pas apparaître du tout.

---

## 3. Règles non négociables

1. **Administrable sans prestataire.** Catégories, personnes, règles d'attribution, canaux et délais vivent dans des données modifiables par la référente, jamais en dur dans le code.
2. **Aucune donnée réelle.** Aucun nom de jeune, aucun nom réel de salarié, aucune adresse réelle. Jeu de données fictif et marqué comme tel.
3. **Traçabilité datée.** Chaque changement d'état d'un équipement crée une ligne d'historique (qui, quoi, quand).
4. **La couleur ne porte jamais seule l'information.** Toujours une icône et un libellé avec la couleur.
5. **Seule la vérification du RST clôt un incident.** La déclaration du prestataire ne suffit pas.
6. **Pas d'IA dans le fonctionnement quotidien.** Attribution, tri et notifications reposent sur des règles lisibles (section 9).
7. **Rien n'est perdu.** Une saisie reste sur le téléphone tant que le serveur n'a pas confirmé la réception.

---

## 4. Cible technique

### 4.1 Production (Microsoft 365, connecteurs standard)
| Brique | Rôle |
|---|---|
| Power Apps (application canvas) | Une seule application pour signaler, traiter et consulter. Pas de Microsoft Forms. |
| SharePoint Lists + bibliothèque | Données et photos |
| Power Automate | Attribution, messages Teams, mail Danger, demande de vérification |
| Teams | Réception des fiches par canal de région et en conversation |
| Entra ID | Comptes de l'association, groupes de droits |

### 4.2 Mobile : web app ou application Power Apps
- **Lien web** (`apps.powerapps.com`, ouvert par le QR) : rien à installer, aucun store. **Mais une application Power Apps lancée dans un navigateur ne fonctionne pas sans réseau.**
- **Application Power Apps Mobile** : l'application gratuite de Microsoft, installée une fois (ou poussée par Intune, inclus dans Business Premium). Aucune application propre à publier sur l'App Store ou le Play Store. C'est elle qui permet la saisie hors ligne (`SaveData` / `LoadData`).
- **Décision proposée** : lien web pour tous ceux qui consultent et traitent ; application Power Apps Mobile pour les RST qui vont sur des terrains sans réseau. À valider avec l'association.

### 4.3 Prototype à construire dans VS Code
Objectif : une application web cliquable, fidèle à la cible, pour **tester, montrer et éprouver** le parcours avant de le reconstruire dans Power Apps.

- **Stack** : React 19 + TypeScript + Vite, `lucide-react` pour les icônes, `motion` pour les animations. Pas d'autre dépendance d'interface.
- **Données** : un module `data/` qui expose les mêmes listes et les mêmes champs que les listes SharePoint (section 6). Stockage dans `localStorage` (persistant après rechargement). Un jeu fictif de 80 terrains et environ 210 équipements est généré au premier lancement, avec un bouton « Réinitialiser les données » dans les outils de test.
- **Couche d'accès** : toutes les lectures et écritures passent par `data/repository.ts` (`list`, `get`, `create`, `update`). Aucun composant ne lit le stockage directement. Cela permet de remplacer plus tard par de vrais appels.
- **Réseau simulé** : un état `online` piloté par l'interrupteur des outils de test et par `navigator.onLine`. Hors ligne, les créations partent dans une file locale (`outbox`) au lieu d'être écrites dans les listes.
- **Mode téléphone** : le parcours RST s'affiche dans un cadre de téléphone (390 × 844) à droite de l'écran sur ordinateur, et en plein écran sur un vrai téléphone. Un sélecteur « App Power Apps / Navigateur » reproduit la contrainte de la section 4.2 : en mode Navigateur et hors ligne, l'enregistrement est impossible et un message l'explique.
- **Notifications simulées** : un centre de notifications affiche les messages Teams et les mails qui seraient envoyés, avec destinataire, canal et règle appliquée.

---

## 5. Personas et droits

| Persona | Lit | Crée | Modifie |
|---|---|---|---|
| RST | Ses terrains, la bannette commune, les carnets | Incidents, validations | Ses brouillons |
| Directeur national des infrastructures | Tout | Interventions | Prise en charge, statut des incidents |
| PPUB (par région) | Sa région, la bannette commune | Interventions sur sa région | Prise en charge sur sa région |
| Référente de l'association | Tout | Terrains, équipements, personnes, règles | Paramètres, droits, QR codes |

Pas de connexion en v1 : un sélecteur de persona s'affiche au démarrage et reste accessible dans l'en-tête. En production, les droits sont portés par les listes SharePoint (groupes Entra ID), pas seulement par l'interface.

Personas fictifs du jeu de démo : Karim B. (RST, Terrain Lyon 3), Léa M. (suppléante), Nadia R. (PPUB Auvergne-Rhône-Alpes), « Directeur infra (démo) », « Référente (démo) ».

---

## 6. Modèle de données

Les noms ci-dessous sont ceux des listes SharePoint cibles. Les types JSON du prototype doivent les reprendre à l'identique.

**Terrains** : `id` (texte stable, ex. `T-LYO-03`), `nom`, `commune`, `region` (HDF, IDF, PDL, ARA, PACA), `situationJuridique` (Campus propriétaire / Convention avec la ville / Terrain sans convention / Terrain de la ville), `quiRepare` (Association / Ville / À arbitrer), `rst`, `suppleant`, `ppub`, `actif`, `coordonnees` (validées, optionnelles en v1).

**Equipements** : `id` (ex. `EQ-LYO3-BF1`, encodé dans le QR), `terrainId`, `type` (But de football, Panier de basket, Cage multisport, Agrès street workout, Filet pare-ballons, Clôture, Sol synthétique), `emplacement`, `etat` (voir 7.1), `dateDernierEvenement`, `actif`.

**Incidents** : `idLocal` (UUID généré sur le téléphone, clé de déduplication), `numero` (INC-AAAA-NNN, attribué par le serveur), `equipementId`, `type` (Casse / Instabilité / Usure / Vandalisme), `categorie` (Structure / Fixation / Filet / Sol / Autre), `constat`, `urgence` (Faible / À traiter / Danger), `auteur`, `dateObservation`, `dateReception`, `saisiHorsLigne`, `statut` (voir 7.2), `attribueA`, `regleAppliquee`, `pourInfo` (liste), `photoAvant`.

**Interventions** : `id`, `incidentId`, `prestataire` (texte libre en v1), `date`, `priseEnCharge` (Association / Ville / Garantie prestataire), `saisiPar`.

**Validations** : `id`, `incidentId`, `resultat` (OK / KO), `commentaire`, `photoApres`, `rst`, `date`.

**Regles** : `ordre`, `condition` (champ, opérateur, valeur), `attribueA` (rôle), `pourInfo` (rôles), `canal`, `actif`. Voir 9.1.

**Parametres** : clé / valeur. Ex. `canalTeams.ARA`, `mailDanger`, `delaiRelanceHeures` (V2), `tailleMaxPhotoKo`.

**Historique** : pas de liste dédiée. Le carnet se reconstruit en joignant Incidents, Interventions et Validations sur `equipementId`, triés par date.

---

## 7. États et transitions

### 7.1 État d'un équipement (pastille)
| État | Couleur | Icône Lucide | Libellé | Quand |
|---|---|---|---|---|
| ok | vert | `check` | Vérifié | Aucun incident ouvert |
| warn | orange | `circle-alert` | Incident ouvert | Incident ouvert, urgence Faible ou À traiter |
| bad | rouge | `triangle-alert` | Danger | Incident ouvert, urgence Danger |
| blue | bleu | `wrench` | Réparé, à vérifier | Intervention enregistrée, en attente du RST |
| grey | gris | `circle-help` | Pas d'info récente | Proposition : aucun contrôle ni incident depuis plus de 120 jours (seuil en paramètre) |

L'état d'un **terrain** est celui de son équipement le plus critique (ordre : bad > warn > blue > grey > ok), affiché avec le nombre d'équipements concernés. Vert signifie « vérifié », pas « certifié sûr ».

### 7.2 Cycle de vie d'un incident
```
Brouillon local ──(envoi)──> Nouveau ──(prise en charge)──> Pris en charge
      │                         │                                 │
   (hors ligne)                 └────────(intervention)───────────┤
      v                                                           v
En attente réseau                                       Réparé, à vérifier
                                                          │            │
                                                     (OK RST)      (KO RST)
                                                          v            v
                                                  Validé par le RST   Rouvert ──> (nouvelle intervention)
```
- `Nouveau` et `Rouvert` sont « À prendre » tant que personne n'a pris en charge.
- `Validé par le RST` est le seul état final. Il remet l'équipement à `ok`.

---

## 8. Écrans

Charte : section 13. Chaque écran a un état vide, un état de chargement et un état d'erreur.

### 8.1 Poste de travail (ordinateur, lien web)

**E1. Accueil « Où devons-nous agir ? »**
- En-tête collant : marque, fil d'Ariane (France > Région > Terrain), Rechercher (⌘ K), persona, Téléphone RST (outil de test), thème clair/sombre, « Sous le capot ».
- 4 indicateurs cliquables qui filtrent la page : Danger, À prendre en charge, Réparés à vérifier, Récidives (V2).
- Colonne gauche : « État du parc », vue **Liste** en v1 (Terrain, Équipement, État, Dernier événement, RST), triable, filtrable par région et par recherche. La vue Carte est V2.
- Colonne droite : **Bannettes** (E2).

**E2. Bannettes**
- Onglets : **Ma bannette** (incidents attribués au persona), **Commune** (tous les incidents ouverts du périmètre, visible par tous), **Pour info** (incidents où le persona est en copie).
- Une ligne : icône d'état, équipement + terrain, constat + ancienneté, personne attribuée (avatar ou « Vous »), nombre de personnes en copie, étiquettes (Saisi hors ligne), statut « À prendre » ou « Pris en charge ».
- Tri par règle : nouveaux d'abord, puis gravité, puis non pris en charge, puis ancienneté.
- Pied : « Attribution automatique selon des règles lisibles » + bouton « Voir les règles » (E6).

**E3. Fiche terrain** (panneau latéral)
- Région, nom, pastille, nombre d'équipements, RST, suppléant, situation juridique, qui répare, liste des équipements avec leur état. Un clic ouvre le carnet.

**E4. Carnet de santé d'un équipement** (fenêtre)
- En-tête : icône d'état, terrain, type, pastille, identifiant.
- Gauche : alertes (en attente de vérification, récidive en V2), photos avant/après, historique daté.
- Droite : Attribution (attribué à, règle, pour info, canal), Responsabilités, QR code.
- Actions selon le rôle et l'état : « Prendre en charge », « Enregistrer l'intervention » (warn, bad), aucune action de clôture côté directeur.

**E5. Enregistrer l'intervention** (fenêtre compacte)
- Prestataire (choix ou texte libre), date, prise en charge (proposée selon la situation juridique, modifiable).
- Valider : statut « Réparé, à vérifier », ligne d'historique, demande de vérification au RST.

**E6. Règles d'attribution** (référente : modifiable ; autres : lecture)
- Tableau ordonné : Si / Attribué à / Pour info / Canal. Ajout, modification, réordonnancement, activation.
- Rappel : la première règle qui correspond s'applique.

**E7. Administration** (référente)
- Terrains, Équipements, Personnes (RST, suppléant, PPUB par région), Paramètres.
- Génération d'une planche de QR codes par terrain, imprimable en A4.

### 8.2 Téléphone (Power Apps Mobile, ou navigateur)

**M1. Accueil RST « Mes terrains »**
- Bandeau d'état réseau si hors ligne (« Vos saisies restent sur le téléphone et partiront seules »).
- Bouton principal « Scanner un QR code ».
- Section « À vérifier » (demandes de vérification reçues).
- Section « Mes envois » : brouillon, en attente, envoi en cours, envoyé, photo à renvoyer.
- Liste des équipements de ses terrains avec leur état (disponible hors ligne).

**M2. Scanner**
- Viseur caméra. Un QR connu ouvre M3 (ou M6 si une vérification est en attente sur cet équipement).
- QR inconnu ou équipement inactif : message clair + choix dans la liste de ses terrains.

**M3. Signaler**
- Équipement et terrain pré-remplis par le QR.
- 1. Type (puces), 2. Catégorie (puces), 3. Constat (une phrase), photo (fortement conseillée), urgence (Faible / À traiter / Danger).
- Bouton « Envoyer » en ligne, « Enregistrer sur le téléphone » hors ligne. Inactif tant que type, catégorie, constat et urgence ne sont pas remplis.

**M4. Confirmation**
- En ligne : « Signalement envoyé, attribué automatiquement. »
- Hors ligne : « Gardé sur le téléphone. Il partira dès que le réseau revient, même si vous fermez l'app. »

**M5. Mes envois** : détail de la file locale, bouton « Synchroniser maintenant », reprise de la photo seule si elle a échoué.

**M6. Vérifier**
- Photo de départ, résumé de l'intervention, prise de la photo « après ».
- « OK, validé » (exige la photo après) ou « KO, rouvrir ».

---

## 9. Règles métier

### 9.1 Attribution (données de la liste Regles)
| Ordre | Si | Attribué à | Pour info | Canal |
|---|---|---|---|---|
| R1 | Urgence = Danger | Directeur infra | RST du terrain, suppléant, PPUB de la région | Teams + mail |
| R2 | Catégorie = Structure ou Fixation | Directeur infra | RST du terrain | Teams |
| R3 | Terrain de la ville ou sous convention | PPUB de la région | Directeur infra | Teams |
| R4 | Autres cas | RST du terrain | Personne | Bannette seulement |

- La première règle vraie s'applique. Le résultat (`attribueA`, `regleAppliquee`, `pourInfo`) est enregistré sur l'incident au moment de la réception, pour que l'historique reste juste si les règles changent.
- L'auteur du signalement n'est jamais en copie de son propre incident.
- **Pourquoi « Pour info »** : le responsable de l'infrastructure agit, c'est son rôle. Les autres sont prévenus seulement quand c'est sérieux, pour prendre l'habitude d'aller voir sans être noyés. C'est un levier d'accompagnement au changement, pas une obligation d'agir.

### 9.2 Notifications
Principe : Teams pour le flux, le mail pour l'urgence, l'application pour l'état. Rien quand tout va bien.

| Événement | Destinataires | Canal |
|---|---|---|
| Nouvel incident | Canal Teams de la région + personne attribuée | Teams (fiche avec lien vers le carnet) |
| Urgence Danger | Personne attribuée + suppléant | Teams + mail immédiat |
| Incident sérieux (R1, R2) | Personnes « Pour info » | Teams « à regarder » |
| Réparé, à vérifier | RST du terrain | Teams (conversation, lien direct vers M6) |
| Vérification OK ou KO | Personne attribuée | Teams |
| Saisie en attente, envoi échoué | RST | Dans l'application, pas de push |
| Non pris en charge après 48 h (V2) | PPUB puis direction des territoires | Teams, puis mail |

Pas de notification push Power Apps en v1 (connecteur à vérifier, probablement premium).

### 9.3 Hors ligne et synchronisation
- Chaque saisie reçoit un `idLocal` (UUID) sur le téléphone. Le serveur refuse un `idLocal` déjà reçu : une nouvelle tentative ne crée jamais de doublon.
- La saisie est supprimée du téléphone seulement après confirmation du serveur, texte **et** photo.
- Si le texte passe et la photo échoue : état « Photo à renvoyer », reprise de la photo seule.
- `dateObservation` (téléphone) et `dateReception` (serveur) sont toutes deux conservées et affichées.
- Envoi automatique au retour du réseau tant que l'application est ouverte, et bouton manuel. L'envoi application fermée n'est pas garanti : on l'affiche honnêtement.
- Équipement désactivé entre le chargement et l'envoi : le signalement est conservé et marqué « rattachement à vérifier ».
- Photos compressées sur le téléphone (taille maximale en paramètre).

### 9.4 Prise en charge proposée selon la situation juridique
| Situation | Qui répare (proposé) |
|---|---|
| Campus propriétaire | Association |
| Convention avec la ville | Ville (convention) |
| Terrain de la ville | Ville |
| Terrain sans convention | À arbitrer |

---

## 10. Parcours à construire et à tester

Ce sont les parcours réels. Chacun doit pouvoir être joué de bout en bout dans le prototype et automatisé (section 15).

**P1. Signaler un danger sans réseau**
1. Persona RST. M1 affiche le bandeau hors ligne.
2. Scanner le QR du but de football du Terrain Lyon 3 (M2), M3 s'ouvre pré-rempli.
3. Type Casse, catégorie Structure, constat, photo, urgence Danger. « Enregistrer sur le téléphone ».
4. M4 confirme. M1 affiche l'envoi « En attente ».
5. Recharger la page (simule la fermeture de l'application) : l'envoi est toujours là.
Attendu : rien dans les listes, une entrée dans `outbox`.

**P2. Retour du réseau, attribution, notifications**
1. Rétablir le réseau. L'envoi passe à « Envoi » puis « Envoyé ».
2. L'incident est créé avec numéro, `saisiHorsLigne = oui`, `dateObservation` et `dateReception` différentes.
3. Règle R1 appliquée : attribué au directeur, pour info suppléante et PPUB.
4. Notifications : fiche Teams dans le canal de la région, mail Danger, message « Pour info ».
5. Côté directeur : l'incident est en tête de « Ma bannette », visible dans « Commune », et dans « Pour info » pour la PPUB. L'équipement passe à Danger.

**P3. Enregistrer l'intervention**
1. Persona directeur. Ouvrir le carnet depuis la bannette.
2. « Enregistrer l'intervention » : prestataire « Services techniques de la ville » proposé (convention), valider.
3. Équipement « Réparé, à vérifier ». Le RST reçoit la demande. Ligne d'historique créée.

**P4. Vérifier sur place**
1. Persona RST. M1 affiche « À vérifier ». Ouvrir M6 (ou scanner le QR).
2. Photo après, « OK, validé ».
3. Incident « Validé par le RST », équipement Vérifié, directeur prévenu, photos avant/après dans le carnet.
4. Variante KO : incident « Rouvert », de nouveau « À prendre ».

**P5. Consulter un carnet** : depuis la liste, la recherche ou un scan, le carnet affiche l'historique complet et les responsabilités.

**P6. Modifier une règle** (référente) : changer R3 pour attribuer au directeur. Un nouvel incident sur un terrain de la ville suit la nouvelle règle, les anciens gardent leur attribution d'origine.

**P7. Version navigateur sans réseau** : mode Navigateur + hors ligne. Le scan et l'enregistrement sont bloqués avec un message qui renvoie vers l'application Power Apps.

---

## 11. User stories et critères d'acceptation

### Itération 1 : Signalement depuis le terrain
**US 1.1 Scanner** : En tant que RST, je scanne le QR d'un équipement pour ne rien saisir à la main.
- Étant donné un QR valide, quand je scanne, alors M3 s'ouvre avec le terrain et l'équipement.
- Étant donné un QR inconnu, alors un message s'affiche et je peux choisir dans la liste de mes terrains.

**US 1.2 Signaler en 3 champs** : En tant que RST, je saisis type, catégorie, constat, photo et urgence.
- Le bouton reste inactif tant que type, catégorie, constat et urgence manquent.
- À l'envoi, un incident « Nouveau » est créé avec auteur, date d'observation et photo.
- L'équipement passe à warn, ou bad si urgence Danger.
- Mesure : 3 actions après le scan, moins de 30 s (chronométré sur 5 personnes).

**US 1.3 Mes envois** : En tant que RST, je vois mes signalements et leur statut.

### Itération 2 : Hors ligne
**US 2.1 Saisir sans réseau** : la saisie est gardée sur le téléphone avec un `idLocal` et survit à une fermeture forcée.
**US 2.2 Envoyer au retour du réseau** : envoi automatique, sans doublon, suppression locale après confirmation texte et photo, reprise de la photo seule.
**US 2.3 Référentiel hors ligne** : mes terrains et équipements restent consultables sans réseau.
**US 2.4 Version navigateur** : hors ligne dans le navigateur, l'application l'explique et ne fait rien perdre en silence.

### Itération 3 : Attribution, bannettes et notifications
**US 3.1 Attribution automatique** : à la réception, la première règle vraie fixe `attribueA`, `regleAppliquee` et `pourInfo`.
**US 3.2 Bannettes** : chaque persona voit Ma bannette, Commune et Pour info, avec compteurs à jour.
**US 3.3 Fiche Teams** : chaque nouvel incident poste une fiche dans le canal de la région (lu dans Parametres), avec lien vers le carnet.
**US 3.4 Danger** : un mail part immédiatement à la personne attribuée et au suppléant.
**US 3.5 Pour info** : les personnes en copie reçoivent un message « à regarder » pour R1 et R2 uniquement.
**US 3.6 Prendre en charge et enregistrer l'intervention** : la prise en charge proposée dépend de la situation juridique ; l'équipement passe à « Réparé, à vérifier ».

### Itération 4 : Vérification RST
**US 4.1 Demande de vérification** : le RST du terrain reçoit une demande Teams avec un lien direct vers M6.
**US 4.2 Vérifier** : OK exige une photo après et clôt l'incident ; KO le rouvre. Seule cette action clôt.

### Transverse
**US 5.1 Carnet de santé** : pastille, historique daté, photos, attribution, responsabilités, QR. Aucune information par la couleur seule.
**US 5.2 Planche de QR codes** : la référente imprime les QR d'un terrain en A4.
**US 5.3 Règles administrables** : la référente modifie les règles sans toucher au code ; l'historique des incidents passés ne change pas.

---

## 12. Place de l'IA

Contrainte de l'association : l'IA ne doit pas entrer dans le processus quotidien.

| Où | Usage | Garde-fou |
|---|---|---|
| Construction | Générer écrans, formules, flux, tests, documentation | Relu par un humain avant fusion |
| Évolution et gouvernance | Décrire une évolution en langage naturel, l'IA propose la modification et la documentation | Validation humaine, historique des versions |
| Quotidien | Rien en v1. Plus tard, éventuellement une suggestion de priorité affichée comme telle | Jamais une décision, l'application marche sans |

Vigilance : la création d'application par conversation dans Power Apps peut créer des tables Dataverse par défaut, donc des licences premium. Le vérifier avant de l'utiliser.

---

## 13. Charte et interactions

Reprendre le rendu de `index.html`.

**Tokens (clair)** : fond `#f5f5f7`, surface `#ffffff`, surface secondaire `#f7f7f9`, texte `#242429`, titre `#18181b`, texte secondaire `#686872`, bordure `#e6e6eb`. Accent (sélection et données uniquement) `#635bff`, fond accent `#f0efff`. Action principale en encre neutre `#2a2a30`, une seule par écran. Statuts texte : vert `#00843c`, orange `#b45700`, rouge `#d62231`, bleu `#0b6bcf`.
**Tokens (sombre, « Graphite »)** : fond `#18181b`, surface `#212125`, texte `#e4e4e9`, bordure `#33333a`, accent `#a49dff`.
**Formes** : cartes 16 px, fenêtres 22 px, contrôles 10 px, boutons d'en-tête 40 px de haut, rayon 8,8 px. Ombres en deux couches douces.
**Typographie** : Inter. Titre de page 26 px graisse 820. Titre de section 12 px majuscules graisse 650. Corps 14 px. Légende 11,5 px. Chiffres en `tabular-nums`.
**Icônes** : `lucide-react` uniquement (Moon, Sun, Search, Smartphone, LayoutGrid, ScanQrCode, Camera, TriangleAlert, CircleAlert, Check, Wrench, CircleHelp, Inbox, Bell, Eye, Users, Mail, Plane, Wifi, Settings2, ChevronRight).
**Mouvement** (`motion`) : 160 ms `cubic-bezier(.2,.8,.2,1)` pour les survols ; segment actif qui glisse entre les onglets ; fenêtres qui montent de 12 px ; listes qui apparaissent en cascade (28 ms par ligne, 8 lignes max) ; compteurs animés sur 420 ms ; respecter `prefers-reduced-motion`.
**Sobriété** : pas de barre colorée au début des cartes, pas de dégradé sauf sur le bouton de scan et la marque, pas plus de 4 indicateurs, une seule action principale par écran, pas de texte qui explique l'interface.
**Accessibilité** : contraste AA, focus visible au clavier, cibles tactiles de 44 px minimum sur mobile, libellés sur toutes les icônes seules.

---

## 14. Plan de construction dans VS Code

```
src/
  app/            App.tsx, routes, thème, persona courant
  data/           types.ts (section 6), seed.ts (jeu fictif), repository.ts, outbox.ts, rules.ts, notify.ts
  features/
    desk/         Accueil, Liste, Bannettes, FicheTerrain, Carnet, Intervention
    mobile/       PhoneFrame, AccueilRST, Scanner, Signaler, Confirmation, MesEnvois, Verifier
    admin/        Regles, Terrains, Equipements, Personnes, Parametres, PlancheQR
    test-tools/   barre Outils de test : persona, réseau, App/Navigateur, réinitialiser, centre de notifications
  ui/             composants partagés (Card, Chip, Seg, Badge, Modal, Toast, Avatar)
tests/            scénarios Playwright P1 à P7
```

Ordre :
1. `types.ts`, `seed.ts`, `repository.ts` + tests unitaires des règles (`rules.ts`) et des transitions (7.2)
2. Mobile M1 à M4 et `outbox.ts` (itérations 1 et 2), puis P1
3. Synchronisation, attribution, notifications simulées, bannettes (itération 3), puis P2
4. Carnet, intervention, vérification (itération 4), puis P3 à P5
5. Administration et règles, puis P6 ; mode navigateur, puis P7
6. Passe de finition : charte, animations, états vides, accessibilité, thème sombre

---

## 15. Tests

**Automatisés (Playwright)** : un test par parcours P1 à P7, qui vérifie l'état des données (repository) en plus de l'écran.

**Unitaires** : règles d'attribution (chaque règle, ordre, auteur exclu de la copie), transitions d'état, déduplication par `idLocal`, agrégation de l'état d'un terrain.

**Sur vrai téléphone (cible Power Apps, avant déploiement)**
1. Première ouverture en ligne, puis usage en mode avion
2. Saisie + photo en mode avion, fermeture forcée, réouverture : rien n'est perdu
3. Envoi interrompu puis repris
4. Double appui ou nouvelle tentative : un seul incident
5. Texte transmis, photo échouée : reprise de la photo seule
6. Équipement désactivé entre chargement et envoi
7. Un lecteur ne peut pas modifier un incident (droits sur la liste)
8. Reconnexion après expiration de session
9. Poids des photos

**Définition de « terminé »** : critères d'acceptation passés, parcours automatisé vert, données fictives, paramètres modifiables sans code, documentation de l'écran à jour.

---

## 16. Questions ouvertes pour l'association

1. 80 ou 81 terrains ? 210 ou 300 équipements ?
2. Les RST ont-ils une licence Microsoft 365, Teams sur leur téléphone, et peut-on installer Power Apps Mobile (ou le pousser par Intune) ?
3. Qui valide une restriction ou une fermeture d'équipement ?
4. Délai de prise en charge acceptable avant relance (V2) ?
5. Les règles R1 à R4 correspondent-elles aux vraies responsabilités ?
6. Qui administre au quotidien, et qui est le secours ?
