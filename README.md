 # Bibliothèque Backend

Ce projet est une API backend pour une bibliothèque, développée avec NestJS.

## Prérequis

- Node.js (version 14.x ou supérieure)
- npm (version 6.x ou supérieure) ou yarn (version 1.x ou supérieure)
- Docker (optionnel, pour l'utilisation de la base de données)

## Installation

1. **Cloner le dépôt** :

   ```bash
   git clone https://github.com/votre-utilisateur/bibliotheque-backend.git
   cd bibliotheque-backend
Installer les dépendances :


npm install
ou


yarn install
Configurer la base de données :

Si vous utilisez Docker, vous pouvez démarrer un conteneur PostgreSQL avec la commande suivante :


docker run --name bibliotheque-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bibliotheque -p 5432:5432 -d postgres
Sinon, assurez-vous que votre base de données PostgreSQL est en cours d'exécution et configurez les variables d'environnement dans un fichier .env à la racine du projet :


DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=votre-utilisateur
DATABASE_PASSWORD=votre-mot-de-passe
DATABASE_NAME=bibliotheque
Migrer la base de données :


npm run typeorm migration\:run
ou


yarn typeorm migration\:run
Démarrage
Pour démarrer le serveur de développement, exécutez la commande suivante :


npm run start\:dev
ou


yarn start\:dev
Le serveur sera accessible à l'adresse http://localhost:3000.

Tests
Pour exécuter les tests unitaires, utilisez la commande suivante :


npm run test
ou


yarn test
Scripts disponibles
start : Démarrer l'application en mode production.
start:dev : Démarrer l'application en mode développement avec rechargement à chaud.
build : Compiler l'application.
test : Exécuter les tests unitaires.
test:e2e : Exécuter les tests d'intégration.
lint : Vérifier le code avec ESLint.
format : Formater le code avec Prettier.