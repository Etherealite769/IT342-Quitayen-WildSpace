#!/usr/bin/env python3
"""
Vertical Slice Architecture Refactoring Script for Mobile App
Reorganizes mobile from technical layers to feature-based slices
"""

import shutil
from pathlib import Path
import sys

# Define the refactoring mappings for Mobile
MOBILE_REFACTOR_MAP = {
    # Auth Feature
    ('ui/activities/LoginActivity.kt', 'features/auth/activities/LoginActivity.kt'),
    ('ui/activities/RegisterActivity.kt', 'features/auth/activities/RegisterActivity.kt'),
    ('data/model/AuthModels.kt', 'features/auth/models/AuthModels.kt'),
    ('data/api/AuthService.kt', 'features/auth/services/AuthService.kt'),
    
    # Dashboard Feature
    ('ui/activities/DashboardActivity.kt', 'features/dashboard/activities/DashboardActivity.kt'),
    
    # Shared Infrastructure
    ('data/api/RetrofitClient.kt', 'shared/api/RetrofitClient.kt'),
    ('ui/theme/Color.kt', 'shared/theme/Color.kt'),
    ('ui/theme/Theme.kt', 'shared/theme/Theme.kt'),
    ('ui/theme/Type.kt', 'shared/theme/Type.kt'),
}

def refactor_mobile_files(src_dir):
    """Refactor mobile app files to Vertical Slice Architecture"""
    
    src_path = Path(src_dir) / 'app' / 'src' / 'main' / 'java' / 'com' / 'example' / 'wildspacemobile'
    
    print(f"Starting Mobile App refactoring in: {src_path}")
    print(f"Total files to move: {len(MOBILE_REFACTOR_MAP)}\n")
    
    success_count = 0
    error_count = 0
    
    # Create necessary directories first
    dest_dirs = set()
    for _, dest in MOBILE_REFACTOR_MAP:
        dest_dir = (src_path / dest).parent
        dest_dirs.add(dest_dir)
    
    for dest_dir in dest_dirs:
        dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Move/copy files
    for src_file, dest_file in MOBILE_REFACTOR_MAP:
        try:
            full_src = src_path / src_file
            full_dest = src_path / dest_file
            
            if not full_src.exists():
                print(f"❌ Source not found: {src_file}")
                error_count += 1
                continue
            
            # Ensure destination directory exists
            full_dest.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy file
            shutil.copy2(full_src, full_dest)
            print(f"✅ {src_file} → {dest_file}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ Error processing {src_file}: {e}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Mobile App Refactoring Complete!")
    print(f"Success: {success_count}, Errors: {error_count}")
    print(f"{'='*60}\n")
    print("Next steps:")
    print("1. Delete old directories: ui/, data/")
    print("2. Update package names in Kotlin files to match new paths")
    print("3. Update imports in refactored files")
    print("4. Verify all activities work correctly")
    
    return error_count == 0

if __name__ == "__main__":
    mobile_path = r"c:\Users\Ethereal\IT342-Quitayen-WildSpace-main\mobile"
    success = refactor_mobile_files(mobile_path)
    sys.exit(0 if success else 1)
