#!/bin/bash
"""
Database setup script for StudyQuizAI
Initializes SQLite database and creates tables
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import init_db

if __name__ == "__main__":
    print("🗄️  Initializing StudyQuizAI database...")
    init_db()
    print("✅ Database initialized successfully!")
    print("📊 Tables created:")
    print("   - users")
    print("   - quizzes")
    print("   - quiz_results")
    print("   - payments")
