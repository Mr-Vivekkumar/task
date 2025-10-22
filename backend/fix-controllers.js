const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/modules/users/users.controller.ts',
  'src/modules/categories/categories.controller.ts',
  'src/modules/operations/operations.controller.ts',
  'src/modules/bulk-upload/bulk-upload.controller.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix async functions that don't return values
    content = content.replace(
      /async (\w+)\(req: Request, res: Response\) \{/g,
      'async $1(req: Request, res: Response): Promise<void> {'
    );
    
    // Add ID validation for get/update/delete methods
    content = content.replace(
      /const \{ id \} = req\.params;\s*const (\w+) = await/g,
      'const { id } = req.params;\n      if (!id) {\n        return res.status(400).json({\n          success: false,\n          error: \'ID is required\'\n        });\n      }\n      const $1 = await'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});
