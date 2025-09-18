from app import create_app
from flask_migrate import upgrade
import os
import sys

app = create_app()

# 강제 데이터베이스 초기화 - 모든 환경에서 실행
print("🚀 Starting SODAM Backend Server...")
print("🔍 Checking database initialization...")

with app.app_context():
    try:
        # 데이터베이스 테이블 존재 여부 확인
        from sqlalchemy import inspect
        from extensions import db
        
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print(f"📊 Found tables: {tables}")
        
        if 'user' not in tables:
            print("🔄 User table not found. Running database migration...")
            upgrade()
            print("✅ Database migration completed successfully!")
            
            # 재확인
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📊 Tables after migration: {tables}")
        else:
            print("✅ Database tables already exist")
            
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        print("🔄 Attempting manual table creation...")
        
        try:
            # 마이그레이션 실패 시 직접 테이블 생성
            from models import User
            db.create_all()
            print("✅ Database tables created successfully!")
        except Exception as e2:
            print(f"❌ Manual table creation also failed: {e2}")
            sys.exit(1)

print("🎉 Database initialization completed!")
print("🌐 Server is ready to accept requests...")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
