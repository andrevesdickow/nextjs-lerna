# Lerna + Next.js + Adonis 5

In this tutorial, we’ll be creating a monorepo for the Next.js project. Learn about Next.js. Using a monorepo structure for our app can be very advantageous. A monorepo structure makes it much easier to manage multiple dependent applications or packages.  

In this tutorial, you’ll learn how to build a monorepo using Lerna. We’ll be building a Next.js application which will import components from a separate package.  

Make sure you have installed node package manager (npm) and lerna.
```bash
npm install --global lerna

npm -v && lerna -v
```
Navigate to the working directory and in terminal enter following command to initialize lerna repo.
```bash
lerna init
```

Enter following command to create and initialize npm package inside package folder.  
Follow the instruction to create npm initialized with package.json inside shared folder. You can name ta package as per your convenience.  
Remove **__tests__** and **lib** folder. Create src folder for convenience and add `index.ts` to export from shared package.
```bash
lerna create shared
```

After completion the package created has package.json as following:
PS: update **“main”** property.
```json
{
  "name": "@nextjs-lerna/shared",
  "version": "0.0.0",
  "description": "> TODO: description",
  "author": "Ujjwol Kayastha <uzol123@gmail.com>",
  "homepage": "",
  "license": "MIT",
  "main": "src/index.ts",
  "dependencies": {
    "@types/react": "^17.0.4",
    "dotenv": "^8.2.0",
    "next-images": "^1.7.0",
    "typescript": "~4.2"
  }
}
```

Now let’s create next project inside packages folder.
```bash
cd packages && yarn create next-app frontend
```

Follow the instructions to create next project. Here we’ve created next project named __frontend__.
Clean your next project so that it contains only required files and folders.  
After the above mentioned process.  

Now lets add scripts in package.json of root directory, Now the `package.json` looks like this:
```json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^3.22.1"
  },
  "scripts": {
    "bootstrap": "yarn install; lerna bootstrap;",
    "start": "lerna run start --parallel",
    "start:frontend": "node -r ./dotenv.config.js node_modules/.bin/lerna run --scope frontend --stream dev",
    "build:frontend": "node -r ./dotenv.config.js node_modules/.bin/lerna run --scope frontend --stream build",
    "run:build:frontend": "lerna run start --scope frontend",
    "start:backend": "node -r ./dotenv.config.js node_modules/.bin/lerna run --scope backend --stream dev",
    "build:backend": "node -r ./dotenv.config.js node_modules/.bin/lerna run --scope backend --stream build",
    "run:build:backend": "lerna run start --scope backend"
  },
  "workspaces": [
    "packages/*"
  ]
}
```
Since we are using workspaces. Lets add shared package as dependency in our next project (__frontend__). First let’s add **npmClient** and **useWorkspaces** attributes in `lerna.json` file in root directory.
```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```
Add the name of the package as dependencies. Now your package.json in __frontend__ looks like:
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "10.1.3",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "@nextjs-lerna/shared": "0.0.0"
  }
}
```

Now let’s add `dotenv.config.js` file for environment file configuration that includes. For this configuration file to work add dotenv package using command:
```bash
lerna add dotenv
```

```javascript
const dotenv = require("dotenv")
const path = require("path")
if (process.env.NODE_ENV === "production") {
  dotenv.config({
    path: path.resolve(__dirname, `./.env.production`),
  })
} else {
  dotenv.config({
    path: path.resolve(__dirname, "./.env"),
  })
}
```

Now add `next.config.js` file in root directory of __frontend__ package. and add following libraries for next transpile support.
```bash
lerna add next-compose-plugins --scope=frontend
lerna add next-transpile-modules --scope=frontend
lerna add next-images --scope=frontend
```

`next.config.js` looks like:

```javascript
const withPlugins = require("next-compose-plugins")
const withTM = require("next-transpile-modules")(["@nextjs-lerna/shared"])
const withImages = require("next-images")
module.exports = withPlugins([withTM(), withImages], {
  webpack: (config) => {
    // custom webpack config
    return config
  },
  images: {},
})
```

We can now start our application using command:
```bash
yarn start:frontend
```

Finally let’s add typescript configurations for overall project. Enter following command to add **typescript** for typescript configuration
```bash
lerna add typescript
lerna add @types/react
```

Create `tsconfig.json` file in root directory and add following code:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"],
}
```

and add `tsconfig.json` files in respective packages root directory. We can use extends property. For example in __frontend__ package we’ve added tsconfig file as:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "isolatedModules": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true
  }
}
```
Convert all your **.js** or **.jsx** files in __frontend__ package to **.ts** or **.tsx** accordingly.  

Change the code inside `index.tsx` file in pages inside __frontend__ package to see the change.
Lets test our monorepo by creating a sample button component in shared package and using it in __frontend__ package.

Create folder named components inside src folder in __frontend__ package with sample Button component like:
Button.tsx
```javascript
import React from "react"
export const Button = () => {
  return <button>TEST BUTTON</button>
}
```

Export it from component’s `index.ts` file as:
```javascript
export * from "./Button"
```

Finally export components from src’s `index.ts` as:
```javascript
export * from "./components"
```

Now let’s use the component in __frontend__ package. For simple demo I’ve used the Button in `index.tsx` as:
```javascript
import { Button } from "@nextjs-lerna/shared"
export default function Home() {
  return (
    <div>
      <Button />
    </div>
  )
}
```

Now let’s create adonis5 project inside packages folder.
```bash
cd packages && yarn create adonis-ts-app backend
```

We can now start our application using command:
```bash
yarn start:backend
```

🎉 We’ve successfully created our very own **monorepo** from scratch with typescript configuration using **Next.js**, **Adonis 5** and **lerna**.
Happy coding. 💻
