# 1. Χρησιμοποιούμε επίσημο Node image για το build
FROM node:18-alpine AS build

# 2. Ορίζουμε το working directory
WORKDIR /app

# 3. Αντιγράφουμε τα απαραίτητα αρχεία για το build
COPY package.json package-lock.json ./ 

# 4. Εγκατάσταση dependencies
RUN npm install

# 5. Αντιγραφή του υπόλοιπου project και δημιουργία build
COPY . .
RUN npm run build

# 6. Χρησιμοποιούμε Nginx για το production
FROM nginx:alpine

# 7. Αντιγράφουμε τα αρχεία build στον κατάλογο του Nginx
COPY --from=build /app/build /usr/share/nginx/html

# 8. Αντιγραφή custom Nginx config (για React routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 9. Άνοιγμα του port 80
EXPOSE 80

# 10. Ορίζουμε το default command για το container
CMD ["nginx", "-g", "daemon off;"]
