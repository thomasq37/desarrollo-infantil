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
