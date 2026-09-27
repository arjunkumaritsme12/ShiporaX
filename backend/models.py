from sqlalchemy import Column, Integer, String, Text, JSON
from database import Base

class Release(Base):
    __tablename__ = "releases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    additional_info = Column(Text, nullable=True)
    steps = Column(JSON, nullable=False, default=lambda: [False] * 8)
