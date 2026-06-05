# test_db.py

from database.database import engine

try:
    connection = engine.connect()
    print("Database Connected Successfully")
    connection.close()
except Exception as e:
    print(e)