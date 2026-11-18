# Déploiement

Parc : suivi des contrôles et réparations des 80 terrains de l'association **Sport dans la Ville**. Permet au RST de signaler un incident sur un équipement et au directeur national des infrastructures de suivre les réparations.

## Services

- `frontend/` : export statique Next.js servi par nginx, port 80 du conteneur (8080 publié). Seul service exposé au public.
- `api/` : Node sans dépendance, port 8081. Routes métier sous `/api/v1/...` (le proxy d'entrée ne retire pas le préfixe `/api`).

## Services externes

Aucun pour l'instant (itération 1 : données d'exemple en dur, pas de base de données ni d'appel externe).

## Connu comme fragile ou inachevé

- Le choix de persona (« Qui êtes-vous ? ») est gardé dans le `localStorage` du navigateur, sans compte ni authentification — conforme à la passation (pas de connexion pour cette version).
- Aucun signalement d'incident n'est encore possible : la liste des équipements est figée (itération suivante : formulaire de signalement).

## Contact

Équipe 55 (Sport4Ever), association Sport dans la Ville.
