# Play & Learn — static site served by nginx
FROM nginx:1.27-alpine

# Custom nginx config (caching, gzip, security headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Site files
COPY index.html favicon.ico /usr/share/nginx/html/
COPY img/   /usr/share/nginx/html/img/
COPY css/   /usr/share/nginx/html/css/
COPY js/    /usr/share/nginx/html/js/
COPY games/ /usr/share/nginx/html/games/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
