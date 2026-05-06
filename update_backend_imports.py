#!/usr/bin/env python3
"""
Update imports in backend files after refactoring to Vertical Slice Architecture
"""

import re
from pathlib import Path
import sys

def update_import_in_file(file_path, old_imports, new_imports):
    """Update import statements in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        for old_imp, new_imp in zip(old_imports, new_imports):
            # Update import statement
            content = re.sub(
                rf'^import\s+{re.escape(old_imp)}\.[\w\.]*;',
                lambda m: m.group(0).replace(old_imp, new_imp),
                content,
                flags=re.MULTILINE
            )
            # Also handle specific imports
            content = re.sub(
                rf'import\s+{re.escape(old_imp)}\.',
                f'import {new_imp}.',
                content
            )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def update_backend_imports(backend_path):
    """Update all import statements in refactored backend files"""
    
    base_path = Path(backend_path) / 'src' / 'main' / 'java' / 'edu' / 'cit' / 'quitayen' / 'wildspace'
    
    print("Updating import statements in backend files...")
    print(f"Working directory: {base_path}\n")
    
    # Find all Java files
    java_files = list(base_path.rglob('*.java'))
    print(f"Found {len(java_files)} Java files\n")
    
    update_count = 0
    
    for java_file in java_files:
        relative_path = java_file.relative_to(base_path)
        
        try:
            with open(java_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Define mapping of old packages to new packages
            replacements = [
                # Old model imports to new feature model imports
                ('edu.cit.quitayen.wildspace.model', 'edu.cit.quitayen.wildspace.features'),
                # Old service imports to new feature service imports
                ('edu.cit.quitayen.wildspace.service', 'edu.cit.quitayen.wildspace.features'),
                # Old repository imports to new feature repository imports
                ('edu.cit.quitayen.wildspace.repository', 'edu.cit.quitayen.wildspace.features'),
                # Old security imports to new shared imports
                ('edu.cit.quitayen.wildspace.security', 'edu.cit.quitayen.wildspace.shared.security'),
                # Handle old exception imports
                ('edu.cit.quitayen.wildspace.exception', 'edu.cit.quitayen.wildspace.shared.config'),
            ]
            
            for old_pkg, new_pkg_base in replacements:
                # Replace import statements
                content = re.sub(
                    rf'import\s+{re.escape(old_pkg)}\.([^;]+);',
                    lambda m: handle_import_replacement(m, old_pkg, new_pkg_base),
                    content
                )
            
            if content != original_content:
                with open(java_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Updated: {relative_path}")
                update_count += 1
        except Exception as e:
            print(f"❌ Error: {relative_path}: {e}")
    
    print(f"\n{'='*60}")
    print(f"Import updates complete! Files updated: {update_count}")
    print(f"{'='*60}")

def handle_import_replacement(match, old_pkg, new_pkg_base):
    """Handle smart replacement of imports"""
    class_name = match.group(1)
    
    # Smart mapping based on class name
    if class_name in ['User', 'Room', 'Booking']:
        return f'import {new_pkg_base}.features.auth.{class_name};' if class_name == 'User' \
               else f'import {new_pkg_base}.features.rooms.{class_name};' if class_name == 'Room' \
               else f'import {new_pkg_base}.features.booking.{class_name};'
    elif class_name.startswith('Auth'):
        return f'import {new_pkg_base}.features.auth.{class_name};'
    elif 'Room' in class_name:
        return f'import {new_pkg_base}.features.rooms.{class_name};'
    elif 'Booking' in class_name:
        return f'import {new_pkg_base}.features.booking.{class_name};'
    elif class_name.startswith('Jwt') or class_name == 'SecurityConfig':
        return f'import {new_pkg_base}.shared.security.{class_name};'
    else:
        # For other cases, try to infer from the package
        if old_pkg.endswith('.model'):
            return f'import {new_pkg_base}.features.auth.{class_name};'
        elif old_pkg.endswith('.service'):
            return f'import {new_pkg_base}.features.auth.{class_name};'
        else:
            return match.group(0)

if __name__ == "__main__":
    backend_path = r"c:\Users\Ethereal\IT342-Quitayen-WildSpace-main\backend\wildspace"
    update_backend_imports(backend_path)
