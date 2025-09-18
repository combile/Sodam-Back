from app import create_app
from flask_migrate import upgrade
import os

app = create_app()

# 배포 환경에서 자동으로 데이터베이스 초기화
# CloudType 배포 시 항상 실행되도록 강제 설정
with app.app_context():
    try:
        # 데이터베이스 테이블 존재 여부 확인
        from sqlalchemy import inspect
        inspector = inspect(app.extensions['sqlalchemy'].db.engine)
        tables = inspector.get_table_names()
        
        if 'user' not in tables:
            print("🔄 Database tables not found. Running migration...")
            upgrade()
            print("✅ Database migration completed successfully")
        else:
            print("✅ Database tables already exist")
    except Exception as e:
        print(f"⚠️ Database migration failed: {e}")
        print("Please run 'flask db upgrade' manually")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
