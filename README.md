# Loan payback calculator

> Check which small loans to pay back if you have some extra money

This project is a website where you can list all your loans. When loans are
entered, the script uses Monte Carlo style sampling to figure out which loans
are best to be paid out if you have some extra money to spend on them.

## See it live!

This project is deployed at:

https://velkalaiskuri.herokuapp.com

It's freely acessible and only ever saves data to your local browser.

## Running locally

You can run the project locally by first installing the project dependencies:

```shell
npm i
```

After dependencies have been installed, you can start up the dev server:

```
npm run dev
```

You can now open the project locally at:

http://localhost:8080/

The script fires up Webpack dev server, which starts automatically watching
source files for changes. If you change anything, the changes are hot-reloaded
directly to your browser.

## Building and deploying

This is a static website that you can build by runnning:

```
NODE_ENV=production npm run build
```

This runs the Webpack build tool in production mode and produces a minified
package to `public/` folder. Then you can run:

```
npm start
```

This fires up [`http-server`](https://www.npmjs.com/package/http-server), which
is just a simple static web server.

This project has a Procfile to serve the files from Heroku, but you can serve
the built `public/` folder from any static host.

## Contributing

If you'd like to contribute, please fork the repository, open an issue to tell
me what you want to do and use a feature branch. Pull requests are warmly
welcome!

## Licensing

The code in this project is licensed under MIT license.
