# 选择 Node镜像 作为基础镜像
FROM node:v16.13.1

# 创建工作目录
WORKDIR /app

# 复制package.json 和 package-lock到工作目录
COPY package*.json ./

# 安装依赖
RUN yarn

# 复制项目源代码到工作目录
COPY . .

# 暴露端口 
EXPOSE 8080

# 启动项目
CMD ["yarn", "dev"]