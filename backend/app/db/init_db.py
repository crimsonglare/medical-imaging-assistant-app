from app.db.session import engine, Base
import app.models  # Ensure models are imported

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database tables created.") 