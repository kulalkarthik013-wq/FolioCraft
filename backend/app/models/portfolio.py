from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    filename = Column(String(255), index=True)
    raw_text = Column(Text, nullable=True)
    name = Column(String(255), nullable=True)
    title = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    linkedin = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)
    portfolio = Column(String(255), nullable=True)
    summary = Column(Text, nullable=True)

    user = relationship("User", back_populates="resumes")


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String(255), index=True)
    description = Column(Text, nullable=True)
    link = Column(String(255), nullable=True)

    user = relationship("User", back_populates="projects")


class Skill(Base):
    __tablename__ = "skills"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String(100), index=True)

    user = relationship("User", back_populates="skills")


class Education(Base):
    __tablename__ = "educations"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    institution = Column(String(255), index=True)
    degree = Column(String(255), index=True)
    year = Column(String(50), nullable=True)

    user = relationship("User", back_populates="education")


class Experience(Base):
    __tablename__ = "experiences"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    company = Column(String(255), index=True)
    role = Column(String(255), index=True)
    duration = Column(String(100), nullable=True)

    user = relationship("User", back_populates="experience")


class Certification(Base):
    __tablename__ = "certifications"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String(255), index=True)

    user = relationship("User", back_populates="certifications")