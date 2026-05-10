import sys
import re

files = [
    r"d:\\office-manager_project_v2-main\\office-manager_project_v2-main\\src\\features\\auth\\layouts\\ManagerLayout.tsx",
    r"d:\\office-manager_project_v2-main\\office-manager_project_v2-main\\src\\features\\auth\\layouts\\EmployeeLayout.tsx",
    r"d:\\office-manager_project_v2-main\\office-manager_project_v2-main\\src\\features\\auth\\layouts\\CanteenLayout.tsx",
    r"d:\\office-manager_project_v2-main\\office-manager_project_v2-main\\src\\features\\hr\\layouts\\HRLayout.tsx"
]

def process_file(fpath):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # ensure NavLink is imported
    if 'NavLink' not in content:
        content = re.sub(r'import \{([^\}]+)\} from \'react-router-dom\'', r'import {\1, NavLink} from \'react-router-dom\'', content)
    
    # replace <Link with <NavLink
    content = re.sub(r'<Link ', r'<NavLink ', content)
    content = re.sub(r'</Link>', r'</NavLink>', content)

    # ensure cn is imported
    if 'import { cn }' not in content and 'import {cn}' not in content:
        content = re.sub(r'(import .*? from \'react-router-dom\'\n)', r'\1import { cn } from \'@/utils/cn\'\n', content)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

for fpath in files:
    process_file(fpath)
