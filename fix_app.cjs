const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find where the damage starts and ends
// The bad content is around line 95 - text from the template literal leaking out.
// We need to find the exact bad block and replace it with proper BrandConfig interface + state.

// The broken section: from just before the bad text to after the template literal close
// OLD (broken): starts with "}\n\n- HERO:" and ends with "autônomo.Retorne APENAS..."
// We need to check what's before line 95

// Let's find the PageSection interface and replace the broken section after it
const pageSection = `}

`;

// Find where we need the interface to go
const goodMarker = "  id: string;\r\n  type: ComponentType;\r\n  title?: string;\r\n  subtitle?: string;\r\n  content?: any;\r\n}\r\n";

// What should come after the PageSection closing brace
const correctContent = `  id: string;\r\n  type: ComponentType;\r\n  title?: string;\r\n  subtitle?: string;\r\n  content?: any;\r\n}\r\n\r\ninterface BrandConfig {\r\n  id?: string;\r\n  name?: string;\r\n  primaryBlue: string;\r\n  primaryGold: string;\r\n  description: string;\r\n  fontFamily: string;\r\n  pdfBase64?: string;\r\n  pdfName?: string;\r\n  systemPrompt?: string;\r\n}\r\n\r\ninterface ApiKeys {\r\n  gemini: string;\r\n  openai: string;\r\n  claude: string;\r\n  groq: string;\r\n}\r\n`;

if (content.includes(goodMarker)) {
    // Find the broken section that starts after the PageSection close
    const startIdx = content.indexOf(goodMarker);

    // Find where ApiKeys or the next clean section starts
    const apiKeysMarker = "\r\ninterface ApiKeys {";
    const stateApiKeysMarker = "\r\n  const [apiKeys, setApiKeys]";

    let endIdx = content.indexOf(apiKeysMarker, startIdx);
    if (endIdx === -1) {
        // Maybe the ApiKeys interface is missing too, find the apiKeys state
        endIdx = content.indexOf(stateApiKeysMarker, startIdx);
    }

    if (endIdx !== -1) {
        const before = content.substring(0, startIdx);
        const after = content.substring(endIdx);

        // Check if after starts with ApiKeys interface or state
        if (after.startsWith('\r\ninterface ApiKeys {')) {
            // ApiKeys interface exists, just add BrandConfig before it
            const newContent = before + correctContent + after.substring(2); // skip the leading \r\n
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Fixed: Added BrandConfig interface, ApiKeys interface was present');
        } else {
            // Need to also add what comes after BrandConfig (ApiKeys interface)
            const newBrandSection = before + correctContent;
            const newContent = newBrandSection + "\r\n" + after;
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Fixed: Added BrandConfig interface before apiKeys state');
        }
    } else {
        console.log('ERROR: Could not find end marker');
        console.log('Content around marker:');
        const idx = content.indexOf(goodMarker);
        console.log(content.substring(idx, idx + 500));
    }
} else {
    console.log('ERROR: Could not find PageSection marker');
    console.log('Checking for broken content...');

    // Show what's around line 95 (character-based)
    const lines = content.split('\n');
    console.log('Lines 90-105:');
    for (let i = 89; i < Math.min(105, lines.length); i++) {
        console.log(`${i + 1}: ${lines[i].substring(0, 100)}`);
    }
}
