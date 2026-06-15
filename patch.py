import re

with open(r"c:\Users\User\Desktop\HTML VIGI\data.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace block ending with descricao: "..." to add driveUrl
# It targets videos, artes and others matching the pattern
new_content = re.sub(r'(descricao:\s*".*?")\n\s*\}', r'\1,\n      driveUrl: ""\n    }', content)

with open(r"c:\Users\User\Desktop\HTML VIGI\data.js", "w", encoding="utf-8") as f:
    f.write(new_content)
