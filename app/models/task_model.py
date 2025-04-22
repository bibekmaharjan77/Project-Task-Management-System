from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum
from datetime import datetime


class TaskStatus(str, Enum):
    COMPLETED = "Completed"
    INCOMPLETE = "Incomplete"


class SubTask(BaseModel):
    title: str
    description: str
    assigned_to: str

    @field_validator("title")
    @classmethod
    def validate_subtask_title(cls, value: str):
        if len(value.strip()) < 3:
            raise ValueError("Subtask title must be at least 3 characters long")
        return value

    @field_validator("description")
    @classmethod
    def validate_subtask_description(cls, value: str):
        if len(value.strip()) < 5:
            raise ValueError("Subtask description must be at least 5 characters long")
        
        return value


class TaskRequest(BaseModel):
    project_id: str
    subtasks: List[SubTask]

    def to_internal_dict(self):
        now = datetime.now().isoformat()
        return {
            "project_id": self.project_id,
            "subtasks": [subtask.dict() for subtask in self.subtasks],
            "created_at": now,
            "updated_at": now,
        }
