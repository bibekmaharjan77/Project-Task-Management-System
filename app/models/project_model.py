from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from enum import Enum


class ProjectStatus(str, Enum):
    PLANNING = "Planning"
    IN_PROGRESS = "In Progress"
    ON_HOLD = "On Hold"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class ProjectPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class ProjectRequest(BaseModel):
    name: str
    description: str
    start_date: date
    end_date: Optional[date] = None
    priority: ProjectPriority
    status: ProjectStatus

    @field_validator("name")
    @classmethod
    def validate_name_length(cls, value: str):
        if len(value.strip()) < 3:
            raise ValueError("Project name must be at least 3 characters long")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str):
        if len(value.strip()) < 5:
            raise ValueError("Description must be at least 5 characters long")
        return value

    def to_internal_dict(self):
        now = datetime.now().isoformat()
        return {
            "name": self.name,
            "description": self.description,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "priority": self.priority.value,
            "status": self.status.value,
            "created_at": now,
            "updated_at": now,
        }
