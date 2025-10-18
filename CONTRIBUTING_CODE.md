# Contributing Code

## Introduction

_Mission Sea Turtle Nest_ is primarily built using canvas 2D and `requestAnimationFrame`
which are technologies built into all major browsers. The codebase is written
in vanilla TypeScript and Web Components are leveraged for reusable UI components.

Please also make sure to read and abide by the
[Code of Conduct](CODE_OF_CONDUCT.md) for this community.

## Project setup and startup

The following is a list of useful `npm` commands which may be useful while
debugging the project:

- `npm run dev`: Runs Vite in development mode.
- `npm start`: Alias to the `dev` script above.
- `npm install`: Install necessary packages. To be used when cloning the
  repository.
- `npm run docs`: Generate documentation using Typedoc.

Please also consider installing the following Visual Studio Code extensions
for a better development experience:

- [Prettier+](https://marketplace.visualstudio.com/items?itemName=svipas.prettier-plus)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Adding new characters

Please follow these steps:

1. Place the image in the following path: `/static/images/characters`.
2. Add a class for the given character while extending the appropriate
   abstract class, placing it under `/src/characters`.
3. Implement the override the abstract class as desired.
4. Add an entry for the image filepath in the `precacheResources` array in
   `serviceWorker.js` located at the root.
5. In `/src/levels/LevelCharacter.ts`, add a string for the given character
   in the `CharacterType` custom type.
6. Add a key and constructor for the respective character in the
   `characterMap` object located in `createCharacterInstance.ts` inside the
   `characters` folder like in the following snippet:

```js
TigerShark: TigerShark, // Key to match the _type field in the character class
```

7. Add the character with the desired quantity/ies in the level/s desired, by
   modifying the `_initialCharacters` field. Locate desired level/s at
   `src/levels/Level<x>.ts`.
