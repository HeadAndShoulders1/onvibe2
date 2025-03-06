FROM node:20.5.0

# Копируем файл с паролем в контейнер
COPY payment_password.txt /payment_password.txt

# Экспортируем переменную в систему
RUN echo "export PAYMENT_PASSWORD=$(cat /payment_password.txt)" >> /etc/profile

# Остальные переменные окружения
ENV DATABASE_URL="postgres://postgres.ytrzffiooifalbhvowoz:0a8bca9b1ad34aefb6e500bdfebe0d6d@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?connect_timeout=300"
ENV NEXTAUTH_URL="https://onvibe.fun"
ENV NEXTAUTH_SECRET="JwFTCiKtLyRPHVpuYzgcMwOqqbll1JnDTzx7KTTpZ2k"
ENV AWS_SECRET_ACCESS_KEY="mM7Q71CQQjr5bNtcu7ieDNfMs8uB3gykcvzEn88noj7"
ENV AWS_ACCESS_KEY_ID="apB9bzYnEsmcDSDZzuWB2k"
ENV ENDPOINT_URL="https://hb.vkcs.cloud"
ENV AWS_REGION="ru-msk"
ENV AWS_BUCKET_NAME="onvibe"
ENV NODE_NO_WARNINGS='1'
ENV NODE_OPTIONS='--no-warnings node app/api/releases/upload_cover/route.ts'
ENV NODE_OPTIONS='--no-warnings node app/api/releases/track/add_track/route.ts'
ENV FLUENTFFMPEG_COV='false'
ENV PAYMENT_LOGIN="1741108391300"
ENV NAME_EMAIL="mail@onvibe.fun"
ENV PASS_EMAIL="#3jbtSt_CXWr}d"

WORKDIR /app
COPY . .  

RUN npm i --save
RUN npm i ffmpeg -y
RUN npm run build
RUN npx prisma migrate

EXPOSE 3000
CMD ["npm", "start"]
