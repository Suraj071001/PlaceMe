const fs = require('fs');
const { execSync } = require('child_process');
try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log("Success");
} catch (e) {
    fs.writeFileSync('err.txt', e.stdout.toString() + e.stderr.toString());
    console.log("Failed");
}
