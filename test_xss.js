const assert = require('assert');

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Dragun.app <script>alert("XSS")</script>',
};

const stringified = JSON.stringify(jsonLd);
const replaced = stringified.replace(/</g, '\\u003c');

console.log("Original:", stringified);
console.log("Replaced:", replaced);

assert(!replaced.includes('<'), "Should not contain '<'");
assert(replaced.includes('\\u003c'), "Should contain '\\u003c'");

const parsed = JSON.parse(replaced);
console.log("Parsed Name:", parsed.name);
assert(parsed.name === 'Dragun.app <script>alert("XSS")</script>', "Parsed JSON should have original HTML tags");

console.log("All checks passed!");
