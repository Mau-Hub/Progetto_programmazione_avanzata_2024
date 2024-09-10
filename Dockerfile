FROM node:lts

# Imposta la directory di lavoro nel container
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json per sfruttare la cache Docker
COPY package*.json ./

# Installa tutte le dipendenze, comprese quelle di sviluppo
RUN npm install

# Copia il resto del progetto nella directory di lavoro
COPY . .

# Esponi la porta 3000
EXPOSE 3000

# Comando di default per avviare il container in sviluppo
CMD ["npm", "run", "dev"]