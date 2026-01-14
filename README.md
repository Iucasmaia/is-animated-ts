# is-animated-ts

**is-animated-ts** is a simple TypeScript library for detecting animated images, supporting GIFs, APNG, and WebP formats. Fully typed with comprehensive TypeScript support.

## Install

```bash
yarn add is-animated-ts
# or
npm install is-animated-ts
```

## Features

- ✅ **Full TypeScript support** with type definitions
- ✅ **Zero dependencies** - lightweight and fast
- ✅ **Multiple formats** - GIF, APNG, and WebP
- ✅ **Strict type checking** - catches errors at compile time
- ✅ **Comprehensive documentation** - JSDoc comments throughout

## TypeScript Example

```typescript
import * as fs from 'fs'
import isAnimated from 'is-animated-ts'

const filename = process.argv[2]

fs.readFile(filename, (err: NodeJS.ErrnoException | null, buffer: Buffer) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  const answer = isAnimated(buffer) ? 'Yes' : 'No'
  console.log(`Is "${filename}" animated? ${answer}.`)
})
```

## JavaScript Example

```javascript
const fs = require('fs')
const isAnimated = require('is-animated-ts')

const filename = process.argv[2]

fs.readFile(filename, (err, buffer) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  const answer = isAnimated(buffer) ? 'Yes' : 'No'
  console.log(`Is "${filename}" animated? ${answer}.`)
})
```

## API

### `isAnimated(buffer: Buffer): boolean`

Checks if the provided buffer contains an animated image.

- **Parameters:**
  - `buffer` - The image buffer to check (must be a Node.js Buffer)
- **Returns:** `true` if the image is animated, `false` otherwise
- **Supported formats:** GIF, APNG (Animated PNG), WebP

## TypeScript Benefits

This library is written in TypeScript and provides:

- **Type safety** - Catch errors at compile time
- **Better IDE support** - IntelliSense, auto-completion, and refactoring
- **Documentation** - Inline JSDoc comments with parameter and return types
- **Modern JavaScript** - ES2020 features with backward compatibility

## License

[MIT](LICENSE.md)