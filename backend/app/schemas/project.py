from pydantic import BaseModel


class ProjectBase(BaseModel):
    name: str
    description: str | None = None
    technologies: str | None = None
    github: str | None = None
    demo: str | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True