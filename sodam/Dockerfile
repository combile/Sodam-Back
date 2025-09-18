# Node.js 18 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 모든 파일 복사
COPY . .

# 환경 변수 설정
ARG REACT_APP_KAKAO_MAP_API_KEY
ARG REACT_APP_API_URL
ENV REACT_APP_KAKAO_MAP_API_KEY=$REACT_APP_KAKAO_MAP_API_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# React 앱 빌드
RUN npm run build

# Nginx 이미지 사용
FROM nginx:alpine

# 빌드된 파일을 nginx 디렉토리로 복사
COPY --from=0 /app/build /usr/share/nginx/html

# nginx 설정 파일 복사
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
