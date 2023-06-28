# parkspot 
 
## Project Setup
npm install
### Compiles and Hot-reloads for Development
npm run serve
### Compiles and Minifies for Production
npm run build
### Lints and Fixes Files
npm run lint
### Requirements
Node - 16.13.2
npm - 8.1.2
Vue - 2.6.12
Vuex - 3.6.2
### Dev Dependencies 
- [Vue ESLint](https://eslint.vuejs.org/user-guide/#installation) 
- [Prettier Style Guide](https://willyadrianp.medium.com/vs-code-setup-for-vue-js-with-eslint-airbnb-config-and-prettier-1ddc3fa14eb9) 
 
### Environment Setup 
 
App will run on http://parkspot.localhost:8080/. To configure the DNS in Windows, follow the steps below: 
 
For Windows: 
1. Go to  C:\Windows\System32\drivers\etc  
2. Open the  hosts  file 
3. Change  127.0.0.1   localhost  to  127.0.0.1    parkspot.localhost  
 
For MacOS/Linux: 
1. Add  127.0.0.1       parkspot.localhost  in  /etc/hosts  
 
### Customize Configuration 
See [Configuration Reference](https://cli.vuejs.org/config/). 
 
### Troubleshooting 
1. If there are a lot of linting errors while setting up the project, run  npm install eslint . 
 
### Resources 
See [Resource Link](https://github.com/vuejs/awesome-vue)