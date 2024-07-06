const name = process.argv[2]

import fs from 'fs';
import path from 'path';

try {
    fs.writeFileSync(path.join(import.meta.dirname, "prisma/models/", name + ".prisma"),
        `model ${name}{
  id Int @id @default(autoincrement())
}
`
    )
    console.log(`model ${name} dibuat`);
} catch (error) {
    console.log(`error ${error}`);
}