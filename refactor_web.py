#!/usr/bin/env python3
"""
Vertical Slice Architecture Refactoring Script for Web Frontend
Reorganizes frontend from technical layers to feature-based slices
"""

import os
import shutil
from pathlib import Path
import sys

# Define the refactoring mappings for Web Frontend
WEB_REFACTOR_MAP = {
    # Auth Feature
    ('pages/Login.tsx', 'features/auth/pages/Login.tsx'),
    ('pages/Register.tsx', 'features/auth/pages/Register.tsx'),
    ('contexts/AuthContext.tsx', 'shared/contexts/AuthContext.tsx'),
    ('contexts/useAuth.ts', 'shared/hooks/useAuth.ts'),
    
    # Room Management Feature
    ('pages/Rooms.tsx', 'features/rooms/pages/Rooms.tsx'),
    ('pages/RoomDetails.tsx', 'features/rooms/pages/RoomDetails.tsx'),
    
    # Booking Feature
    ('pages/BookRoom.tsx', 'features/booking/pages/BookRoom.tsx'),
    ('pages/Reservations.tsx', 'features/booking/pages/Reservations.tsx'),
    ('services/bookingService.ts', 'features/booking/services/bookingService.ts'),
    
    # Dashboard Feature
    ('pages/Dashboard.tsx', 'features/dashboard/pages/Dashboard.tsx'),
    
    # Shared Components (already in right place, just move)
    ('components/ui/button.tsx', 'shared/components/ui/button.tsx'),
    ('components/ui/card.tsx', 'shared/components/ui/card.tsx'),
    ('components/ui/input.tsx', 'shared/components/ui/input.tsx'),
    ('components/ui/label.tsx', 'shared/components/ui/label.tsx'),
}

def refactor_web_files(src_dir):
    """Refactor web frontend files to Vertical Slice Architecture"""
    
    src_path = Path(src_dir) / 'src'
    
    print(f"Starting Web Frontend refactoring in: {src_path}")
    print(f"Total files to move: {len(WEB_REFACTOR_MAP)}\n")
    
    success_count = 0
    error_count = 0
    
    # Create necessary directories first
    dest_dirs = set()
    for _, dest in WEB_REFACTOR_MAP:
        dest_dir = (src_path / dest).parent
        dest_dirs.add(dest_dir)
    
    for dest_dir in dest_dirs:
        dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Move/copy files
    for src_file, dest_file in WEB_REFACTOR_MAP:
        try:
            full_src = src_path / src_file
            full_dest = src_path / dest_file
            
            if not full_src.exists():
                print(f"❌ Source not found: {src_file}")
                error_count += 1
                continue
            
            # Ensure destination directory exists
            full_dest.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy file (preserving original for now)
            shutil.copy2(full_src, full_dest)
            print(f"✅ {src_file} → {dest_file}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ Error processing {src_file}: {e}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Web Frontend Refactoring Complete!")
    print(f"Success: {success_count}, Errors: {error_count}")
    print(f"{'='*60}\n")
    print("Next steps:")
    print("1. Delete old directories: pages/, services/, components/, contexts/")
    print("2. Update imports in refactored files to match new paths")
    print("3. Verify all components work correctly")
    
    return error_count == 0

if __name__ == "__main__":
    web_path = r"c:\Users\Ethereal\IT342-Quitayen-WildSpace-main\web"
    success = refactor_web_files(web_path)
    sys.exit(0 if success else 1)
