## Flora Colossus

> Walk your node_modules tree

## Installation

```bash
npm i --save-dev flora-colossus
```

## API

### Enum: `DepType`

```javascript
import { DepType } from 'flora-colossus';

// DepType.PROD --> Production dependency
// DepType.DEV --> Development dependency
// DepType.ROOT --> The root module
```

### Enum: `DepRequireState`

```javascript
import { DepRequireState } from 'flora-colossus';

// DepType.OPTIONAL -> Optional dependency
// DepType.REQUIRED -> Required dependency
```

### Class: `Walker`

```javascript
import { Walker } from 'flora-colossus';

// modulePath is the root folder of your module
const walker = new Walker(modulePath);
```

#### `walker.walkTree()`

Returns `Promise<Module[]>`

Will walk your entire node_modules tree reporting back an array of "modules", each
module has a "path", "name" and "relationship".  See the typescript definition file
for more information.
