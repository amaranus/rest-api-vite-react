## rest-api-vite-react
### Description
Sample of a shopping site with an API server. It does not include features such as cart, sending messages, or shopping.

However, it includes CRUD features such as signing up, showing a profile, changing password, deleting account, adding, deleting and editing items. Of course, it was designed to be open to development. It works with a mongodb server running on the local computer. But it can also be set with online mongodb.

    npm install
    npm run build
    npm start
   for development mode

    npm run dev

   The scripts defined in your `package.json` file serve various purposes for development, production, and maintenance tasks in a Node.js and React environment. Here's a breakdown of what each script does:

- **"dev": "nodemon src/server/main.js -w src/server"**
  This script starts the server using Nodemon, which is a utility that monitors for any changes in your source code and automatically restarts the server. The `-w src/server` option tells Nodemon to watch the `src/server` directory for changes. This is particularly useful during development when you are making frequent changes to your server code.

- **"start": "cross-env NODE_ENV=production node src/server/main.js"**
  This script sets the environment variable `NODE_ENV` to `production` using the `cross-env` utility, which ensures that environment variables are set in a cross-platform compatible way. It then runs your server with Node.js. This script is typically used to start your application in a production environment, where you want to ensure that your application runs with production settings.

- **"build": "vite build"**
  This script uses Vite, a modern frontend build tool, to compile and bundle your React application. It's optimized for production by default, meaning it will minify your code, optimize asset handling, and perform other adjustments to make your application ready for deployment.