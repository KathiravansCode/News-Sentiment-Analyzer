from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.database import Base
 
 
class SearchHistory(Base):
 
    __tablename__ = "search_history"
 
    id = Column(Integer, primary_key=True, index=True)
 
    keyword = Column(String, nullable=False, index=True)
 
    article_count = Column(Integer, default=0)
 
    positive = Column(Integer, default=0)
 
    negative = Column(Integer, default=0)
 
    neutral = Column(Integer, default=0)
 
    searched_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )
 