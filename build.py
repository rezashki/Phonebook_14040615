#!/usr/bin/env python3
"""
Build script for Phonebook Application
Creates a portable Windows executable using PyInstaller
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path


def run_command(command, cwd=None, description=""):
    """Run a shell command and handle errors"""
    print(f"{'='*50}")
    if description:
        print(f"Running: {description}")
    print(f"Command: {command}")
    print(f"{'='*50}")

    try:
        result = subprocess.run(
            command, shell=True, cwd=cwd, check=True, capture_output=True, text=True
        )
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False


def main():
    # Get the project root directory
    project_root = Path(__file__).parent
    backend_dir = project_root / "backend"
    frontend_dir = project_root / "frontend"
    dist_dir = project_root / "dist"

    print("Phonebook Application Build Script")
    print(f"Project root: {project_root}")
    print(f"Backend dir: {backend_dir}")
    print(f"Frontend dir: {frontend_dir}")

    # Step 1: Build the frontend
    print("\nStep 1: Building frontend...")
    if not run_command(
        "npm run build", cwd=frontend_dir, description="Build React frontend"
    ):
        print("Frontend build failed!")
        return False

    # Step 2: Copy frontend build to backend static folder
    print("\nStep 2: Copying frontend build to backend...")
    frontend_build_dir = frontend_dir / "dist"
    backend_static_dir = backend_dir / "static"

    # Remove old static directory if it exists
    if backend_static_dir.exists():
        shutil.rmtree(backend_static_dir)

    # Copy frontend build to backend static
    shutil.copytree(frontend_build_dir, backend_static_dir)
    print(f"Copied frontend build from {frontend_build_dir} to {backend_static_dir}")

    # Step 3: Create PyInstaller spec file if it doesn't exist
    spec_file = backend_dir / "phonebook.spec"
    if not spec_file.exists():
        print("\nStep 3: Creating PyInstaller spec file...")
        # Use forward slashes and raw string to avoid escape issues
        backend_path = str(backend_dir).replace("\\", "/")
        spec_content = f"""# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['app.py'],
    pathex=['{backend_path}'],
    binaries=[],
    datas=[
        ('static', 'static'),
    ],
    hiddenimports=[
        'flask',
        'flask_sqlalchemy',
        'flask_cors',
        'werkzeug',
        'sqlalchemy',
        'sqlite3',
    ],
    hookspath=[],
    hooksconfig={{}},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='Phonebook',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)
"""
        with open(spec_file, "w", encoding="utf-8") as f:
            f.write(spec_content)
        print(f"Created PyInstaller spec file: {spec_file}")

    # Step 4: Run PyInstaller
    print("\nStep 4: Creating executable with PyInstaller...")
    if not run_command(
        "pyinstaller --clean phonebook.spec",
        cwd=backend_dir,
        description="Create executable",
    ):
        print("PyInstaller build failed!")
        return False

    # Step 5: Copy executable to dist directory
    print("\nStep 5: Organizing build output...")
    exe_source = backend_dir / "dist" / "Phonebook.exe"
    exe_dest = dist_dir / "Phonebook.exe"

    # Create dist directory if it doesn't exist
    dist_dir.mkdir(exist_ok=True)

    if exe_source.exists():
        shutil.copy2(exe_source, exe_dest)
        print(f"Executable created: {exe_dest}")
        print(f"File size: {exe_dest.stat().st_size / (1024*1024):.2f} MB")
    else:
        print("Warning: Executable not found at expected location")
        return False

    print("\n" + "=" * 50)
    print("BUILD SUCCESSFUL!")
    print("=" * 50)
    print(f"Executable location: {exe_dest}")
    print("\nTo run the application:")
    print("1. Double-click Phonebook.exe")
    print("2. Open your browser to http://localhost:5000")
    print("\nDefault admin credentials:")
    print("Username: admin")
    print("Password: admin123")
    print("=" * 50)

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
