#!/usr/bin/env python3
"""
Vertical Slice Architecture Refactoring Script for Backend
Reorganizes backend from technical layers to feature-based slices
"""

import os
import re
from pathlib import Path
from shutil import copy2
import sys

# Define the refactoring mappings
REFACTOR_MAP = {
    # Auth Feature
    'controller/AuthController.java': {
        'dest': 'features/auth/AuthController.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth',
        'imports_update': {
            'edu.cit.quitayen.wildspace.dto.request': 'edu.cit.quitayen.wildspace.features.auth.dto.request',
            'edu.cit.quitayen.wildspace.dto.response': 'edu.cit.quitayen.wildspace.features.auth.dto.response',
            'edu.cit.quitayen.wildspace.service': 'edu.cit.quitayen.wildspace.features.auth',
        }
    },
    'service/AuthService.java': {
        'dest': 'features/auth/AuthService.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth',
        'imports_update': {
            'edu.cit.quitayen.wildspace.dto.request': 'edu.cit.quitayen.wildspace.features.auth.dto.request',
            'edu.cit.quitayen.wildspace.dto.response': 'edu.cit.quitayen.wildspace.features.auth.dto.response',
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.auth',
            'edu.cit.quitayen.wildspace.repository': 'edu.cit.quitayen.wildspace.features.auth',
            'edu.cit.quitayen.wildspace.security': 'edu.cit.quitayen.wildspace.shared.security',
        }
    },
    'model/User.java': {
        'dest': 'features/auth/User.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth',
        'imports_update': {}
    },
    'repository/UserRepository.java': {
        'dest': 'features/auth/UserRepository.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth',
        'imports_update': {
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.auth',
        }
    },
    'dto/request/LoginRequest.java': {
        'dest': 'features/auth/dto/request/LoginRequest.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth.dto.request',
        'imports_update': {}
    },
    'dto/request/SignUpRequest.java': {
        'dest': 'features/auth/dto/request/SignUpRequest.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth.dto.request',
        'imports_update': {}
    },
    'dto/response/AuthResponse.java': {
        'dest': 'features/auth/dto/response/AuthResponse.java',
        'package': 'edu.cit.quitayen.wildspace.features.auth.dto.response',
        'imports_update': {}
    },
    
    # Room Feature
    'controller/RoomController.java': {
        'dest': 'features/rooms/RoomController.java',
        'package': 'edu.cit.quitayen.wildspace.features.rooms',
        'imports_update': {
            'edu.cit.quitayen.wildspace.dto.request': 'edu.cit.quitayen.wildspace.features.rooms.dto.request',
            'edu.cit.quitayen.wildspace.dto.response': 'edu.cit.quitayen.wildspace.features.rooms.dto.response',
            'edu.cit.quitayen.wildspace.service': 'edu.cit.quitayen.wildspace.features.rooms',
        }
    },
    'service/RoomService.java': {
        'dest': 'features/rooms/RoomService.java',
        'package': 'edu.cit.quitayen.wildspace.features.rooms',
        'imports_update': {
            'edu.cit.quitayen.wildspace.dto.request': 'edu.cit.quitayen.wildspace.features.rooms.dto.request',
            'edu.cit.quitayen.wildspace.dto.response': 'edu.cit.quitayen.wildspace.features.rooms.dto.response',
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.rooms',
            'edu.cit.quitayen.wildspace.repository': 'edu.cit.quitayen.wildspace.features.rooms',
        }
    },
    'model/Room.java': {
        'dest': 'features/rooms/Room.java',
        'package': 'edu.cit.quitayen.wildspace.features.rooms',
        'imports_update': {}
    },
    'repository/RoomRepository.java': {
        'dest': 'features/rooms/RoomRepository.java',
        'package': 'edu.cit.quitayen.wildspace.features.rooms',
        'imports_update': {
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.rooms',
        }
    },
    'dto/request/CreateRoomRequest.java': {
        'dest': 'features/rooms/dto/request/CreateRoomRequest.java',
        'package': 'edu.cit.quitayen.wildspace.features.rooms.dto.request',
        'imports_update': {}
    },
    'dto/response/RoomResponse.java': {
        'dest': 'features/rooms/dto/response/RoomResponse.java',
        'package': 'edu.cit.quitayen.wildspace.features.rooms.dto.response',
        'imports_update': {}
    },
    
    # Booking Feature
    'controller/BookingController.java': {
        'dest': 'features/booking/BookingController.java',
        'package': 'edu.cit.quitayen.wildspace.features.booking',
        'imports_update': {
            'edu.cit.quitayen.wildspace.dto.request': 'edu.cit.quitayen.wildspace.features.booking.dto.request',
            'edu.cit.quitayen.wildspace.dto.response': 'edu.cit.quitayen.wildspace.features.booking.dto.response',
            'edu.cit.quitayen.wildspace.service': 'edu.cit.quitayen.wildspace.features.booking',
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.booking',
        }
    },
    'service/BookingService.java': {
        'dest': 'features/booking/BookingService.java',
        'package': 'edu.cit.quitayen.wildspace.features.booking',
        'imports_update': {
            'edu.cit.quitayen.wildspace.dto.request': 'edu.cit.quitayen.wildspace.features.booking.dto.request',
            'edu.cit.quitayen.wildspace.dto.response': 'edu.cit.quitayen.wildspace.features.booking.dto.response',
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.booking',
            'edu.cit.quitayen.wildspace.repository': 'edu.cit.quitayen.wildspace.features.booking',
        }
    },
    'model/Booking.java': {
        'dest': 'features/booking/Booking.java',
        'package': 'edu.cit.quitayen.wildspace.features.booking',
        'imports_update': {}
    },
    'repository/BookingRepository.java': {
        'dest': 'features/booking/BookingRepository.java',
        'package': 'edu.cit.quitayen.wildspace.features.booking',
        'imports_update': {
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.booking',
        }
    },
    'dto/request/CreateBookingRequest.java': {
        'dest': 'features/booking/dto/request/CreateBookingRequest.java',
        'package': 'edu.cit.quitayen.wildspace.features.booking.dto.request',
        'imports_update': {}
    },
    'dto/response/BookingResponse.java': {
        'dest': 'features/booking/dto/response/BookingResponse.java',
        'package': 'edu.cit.quitayen.wildspace.features.booking.dto.response',
        'imports_update': {}
    },
    
    # Shared Infrastructure
    'security/JwtTokenProvider.java': {
        'dest': 'shared/security/JwtTokenProvider.java',
        'package': 'edu.cit.quitayen.wildspace.shared.security',
        'imports_update': {}
    },
    'security/JwtAuthenticationFilter.java': {
        'dest': 'shared/security/JwtAuthenticationFilter.java',
        'package': 'edu.cit.quitayen.wildspace.shared.security',
        'imports_update': {
            'edu.cit.quitayen.wildspace.security': 'edu.cit.quitayen.wildspace.shared.security',
        }
    },
    'security/SecurityConfig.java': {
        'dest': 'shared/security/SecurityConfig.java',
        'package': 'edu.cit.quitayen.wildspace.shared.security',
        'imports_update': {
            'edu.cit.quitayen.wildspace.security': 'edu.cit.quitayen.wildspace.shared.security',
        }
    },
    'exception/GlobalExceptionHandler.java': {
        'dest': 'shared/config/GlobalExceptionHandler.java',
        'package': 'edu.cit.quitayen.wildspace.shared.config',
        'imports_update': {}
    },
    'config/DataSeeder.java': {
        'dest': 'shared/config/DataSeeder.java',
        'package': 'edu.cit.quitayen.wildspace.shared.config',
        'imports_update': {
            'edu.cit.quitayen.wildspace.config': 'edu.cit.quitayen.wildspace.shared.config',
            'edu.cit.quitayen.wildspace.model': 'edu.cit.quitayen.wildspace.features.auth',
            'edu.cit.quitayen.wildspace.repository': 'edu.cit.quitayen.wildspace.features.auth',
        }
    },
}

def update_file_content(content, package_name, imports_map):
    """Update package declaration and imports in Java file"""
    
    # Update package declaration
    content = re.sub(
        r'^package\s+[^;]+;',
        f'package {package_name};',
        content,
        count=1,
        flags=re.MULTILINE
    )
    
    # Update imports
    for old_pkg, new_pkg in imports_map.items():
        content = re.sub(
            rf'import\s+{re.escape(old_pkg)}\.',
            f'import {new_pkg}.',
            content
        )
    
    return content

def refactor_files(base_path):
    """Main refactoring function"""
    java_base = Path(base_path) / 'src' / 'main' / 'java' / 'edu' / 'cit' / 'quitayen' / 'wildspace'
    
    print(f"Starting refactoring in: {java_base}")
    print(f"Total files to refactor: {len(REFACTOR_MAP)}\n")
    
    success_count = 0
    error_count = 0
    
    for src_path, config in REFACTOR_MAP.items():
        try:
            src_file = java_base / src_path
            dest_rel = config['dest']
            new_package = config['package']
            imports_map = config['imports_update']
            
            if not src_file.exists():
                print(f"❌ Source not found: {src_path}")
                error_count += 1
                continue
            
            # Read source file
            with open(src_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Update content
            new_content = update_file_content(content, new_package, imports_map)
            
            # Create destination directory
            dest_file = java_base / dest_rel
            dest_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Write destination file
            with open(dest_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ {src_path} → {dest_rel}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ Error processing {src_path}: {e}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Refactoring Complete!")
    print(f"Success: {success_count}, Errors: {error_count}")
    print(f"{'='*60}")
    
    return error_count == 0

if __name__ == "__main__":
    backend_path = r"c:\Users\Ethereal\IT342-Quitayen-WildSpace-main\backend\wildspace"
    success = refactor_files(backend_path)
    sys.exit(0 if success else 1)
