from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import DateTime

from datetime import datetime

from database.database import Base


class Article(Base):

    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    source = Column(String, nullable=False)

    category = Column(String)

    author = Column(String)

    description = Column(Text)

    url = Column(String, unique=True)

    published_at = Column(DateTime)

    sentiment = Column(String)

    score = Column(Float)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )