# Utiliser une image officielle de Node.js
FROM node:18-alpine

# Créer un répertoire de travail
WORKDIR /app

# Copier le package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste de l'application
COPY . .

# Exposer le port de l'application React
EXPOSE 3000

# Lancer l'application en mode développement
CMD ["npm", "start"]
