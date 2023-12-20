# Dialtone

This is the home for Dialtone, Dialpad's design system. It includes the resources needed to create consistent,
predictable interfaces that conform to Dialpad’s design principles, language, styles, and best practices.

## Install Dialtone

### Install it via NPM:

```shell
npm install @dialpad/dialtone
```

### Import dialtone:

- CSS/LESS:

```less
@import "node_modules/@dialpad/dialtone-css/lib/dist/css/dialtone.min.css";
```

- Javascript:

```js
import '@dialpad/dialtone-css/lib/dist/css/dialtone.min.css';
```

### Add dialtone's theme class to the `<body>`

- Light mode

```html

<body class="dialtone-theme-light">...</body>
```

- Dark mode

```html

<body class="dialtone-theme-dark">...</body>
```

This will define the Dialtone CSS variables for your desired theme.
It is required to do this for Dialtone to function.

## Building Dialtone locally

To build Dialtone locally, visit
our [installation instructions](https://dialtone.dialpad.design/guides/getting-started/#build-dialtone-locally).

## Contributing

If you're interested in contributing to Dialtone, please read our [contributing docs](.github/CONTRIBUTING.md) **before
submitting a pull request**.

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508)

Please also feel free to contact us via the #dialtone Dialpad channel with any questions.