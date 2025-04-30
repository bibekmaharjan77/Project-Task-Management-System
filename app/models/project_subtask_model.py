from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from enum import Enum

class SubTaskStatus(str, Enum):
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    DONE = "Done"

class SubTaskRequest(BaseModel):
    project_id: str
    title: str
    description: str
    assign_to: str
    status: SubTaskStatus

    @field_validator("project_id")
    @classmethod
    def validate_project_id(cls, value: str):
        if not value.strip():
            raise ValueError("Project ID must not be empty")
        return value

    @field_validator("title")
    @classmethod
    def validate_title_length(cls, value: str):
        if len(value.strip()) < 3:
            raise ValueError("Subtask title must be at least 3 characters long")
        return value

    @field_validator("description")
    @classmethod
    def validate_description_length(cls, value: str):
        if len(value.strip()) < 5:
            raise ValueError("Description must be at least 5 characters long")
        return value

    @field_validator("assign_to")
    @classmethod
    def validate_assign_to(cls, value: str):
        if not value.strip():
            raise ValueError("Assign To field must not be empty")
        return value

    def to_internal_dict(self):
        now = datetime.now().isoformat()
        return {
            "project_id": self.project_id,
            "title": self.title,
            "description": self.description,
            "assign_to": self.assign_to,
            "status": self.status.value,
            "created_at": now,
            "updated_at": now,
        }