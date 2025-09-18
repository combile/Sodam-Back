from app import create_app
from flask_migrate import upgrade
import os

app = create_app()

# 배포 환경에서 자동으로 데이터베이스 초기화
if os.getenv('FLASK_ENV') == 'production' or os.getenv('DATABASE_AUTO_INIT') == 'true':
    with app.app_context():
        try:
            upgrade()
            print("✅ Database migration completed successfully")
        except Exception as e:
            print(f"⚠️ Database migration failed: {e}")
            print("Please run 'flask db upgrade' manually")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
