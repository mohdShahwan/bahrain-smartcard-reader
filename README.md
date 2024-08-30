# Bahrain Smartcard Reader

This project provides an easy-to-use Node.js package to interact with smartcards. It allows you to read data from smartcards and provides TypeScript types for better development experience.

## Features

- **Read Smartcard Data**: Easily read and interact with smartcards using the `readSmartcard` function.
- **TypeScript Support**: Includes TypeScript types for smartcard data with the `SmartcardData` interface.

## Installation

To install the package, use npm:

```bash
npm install bahrain-smartcard-reader
```

## Usage

### Reading Smartcard Data

The `readSmartcard` function allows you to read data from a connected smartcard. Below is an example of how to use it:

```javascript
import { readSmartcard } from 'bahrain-smartcard-reader';

async function getSmartcardData() {
    try {
        const data = await readSmartcard();
        console.log('Smartcard Data:', data);
    } catch (error) {
        console.error('Error reading smartcard:', error);
    }
}

getSmartcardData();
```

### Smartcard Data Type

The package also exports the `SmartcardData` type, which you can use to ensure the data structure you're working with is correct:

```javascript
import { SmartcardData } from 'bahrain-smartcard-reader';

function processSmartcardData(data: SmartcardData) {
    // Process the smartcard data here
}
```

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

### License

This project is licensed under the ISC License. See the LICENSE file in the repository for more details.