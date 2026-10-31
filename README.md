# desarrollo-infantil

Page web bilingue (FR/ES), pensée pour le mobile : échelle de développement Haizea-Llevant (0-5 ans), signaux d'alerte et calendrier vaccinal de Catalogne.

- Date de naissance : l'âge se met à jour tout seul.
- Pour chaque apprentissage : âge où 50 % des enfants le font (« vers ») et où 95 % le font (« la plupart »), lus sur l'échelle.
- Vue « Bientôt » : en cours (entre 50 % et 95 %), dans les 3 prochains mois, et « à vérifier » (non coché après 95 %).
- Cases à cocher avec la date d'acquisition, sauvegardées sur le téléphone.
- Fichiers : `index.html`, `desarrollo.scss` (source du style), `desarrollo.css` (généré), `desarrollo.js`.
- Après modification du SCSS : `npm run css`.

Les âges sont lus sur l'échelle (début de barre = 50 %, passage blanc/gris = 75 %, fin = 95 %) ; ils sont indicatifs et ne remplacent pas l'avis du pédiatre. Les âges des signaux d'alerte restent approximatifs.

## Sur l'écran d'accueil (iPhone)

Safari → Partager → « Sur l'écran d'accueil ». L'icône vient de `apple-touch-icon.png` (180 × 180 px) et le nom de `apple-mobile-web-app-title` dans `index.html`. La page s'ouvre alors en plein écran, comme une app.

## Synchronisation Google Sheets (facultative)

Sans réglage, les cases cochées et la date de naissance restent sur le téléphone. Avec une Google Sheet, elles sont partagées entre plusieurs téléphones et ne se perdent plus.

1. Crée une Google Sheet vide (par exemple « Desarrollo infantil »).
2. Menu **Extensions → Apps Script**, remplace le contenu par celui de `apps-script/Code.gs`, enregistre.
3. **Paramètres du projet** (roue dentée) → **Propriétés du script** → ajoute `KEY` avec un mot secret de ton choix.
4. **Déployer → Nouveau déploiement** → type **Application Web**, « Exécuter en tant que : moi », « Accès : tout le monde » → autorise, puis copie l'URL qui finit par `/exec`.
5. Colle cette URL dans `API_URL`, en haut de `desarrollo.js`, et pousse.
6. Ouvre `https://thomasq37.github.io/desarrollo-infantil/#k=TON_MOT_SECRET` une fois sur chaque téléphone (la clé est ensuite mémorisée), puis ajoute la page à l'écran d'accueil.

La Sheet contient un onglet **Acquis** (clé, élément, date) et un onglet **Réglages** (date de naissance). Ce qui était déjà coché sur le téléphone est envoyé à la première synchronisation. Hors connexion, les changements attendent et partent au retour du réseau.

Après une modification de `Code.gs` : **Déployer → Gérer les déploiements → modifier → Nouvelle version**, sinon l'ancienne version reste active.
