# Fase de construcción
FROM node:16-alpine as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente y construye la aplicación
COPY . .
RUN npm run build

# Fase de producción
FROM nginx:alpine

# Copia los archivos de build al directorio que sirve Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80:80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
