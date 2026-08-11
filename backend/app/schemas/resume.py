from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    filename: str
    filepath: str

    class Config:
        from_attributes = True