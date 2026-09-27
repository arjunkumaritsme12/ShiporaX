import typing
import enum
import strawberry
from models import Release as ReleaseModel
from database import get_db

STEP_LABELS = [
    "Code freeze", "QA testing", "Staging deploy", "Regression testing",
    "Changelog written", "Stakeholder sign-off", "Production deploy", 
    "Post-release monitoring"
]

@strawberry.enum
class ReleaseStatus(enum.Enum):
    PLANNED = "PLANNED"
    ONGOING = "ONGOING"
    DONE = "DONE"

@strawberry.type
class Release:
    id: int
    name: str
    date: str
    additional_info: typing.Optional[str]
    steps: typing.List[bool]
    
    @strawberry.field
    def status(self) -> ReleaseStatus:
        if not self.steps:
            return ReleaseStatus.PLANNED
            
        true_count = sum(1 for step in self.steps if step)
        if true_count == 0:
            return ReleaseStatus.PLANNED
        elif true_count == len(self.steps):
            return ReleaseStatus.DONE
        else:
            return ReleaseStatus.ONGOING

def get_release_type(db_release: ReleaseModel) -> Release:
    return Release(
        id=db_release.id,
        name=db_release.name,
        date=db_release.date,
        additional_info=db_release.additional_info,
        steps=db_release.steps
    )

@strawberry.type
class Query:
    @strawberry.field
    def releases(self) -> typing.List[Release]:
        with get_db() as db:
            db_releases = db.query(ReleaseModel).all()
            return [get_release_type(r) for r in db_releases]

    @strawberry.field
    def release(self, id: int) -> typing.Optional[Release]:
        with get_db() as db:
            db_release = db.query(ReleaseModel).filter(ReleaseModel.id == id).first()
            if db_release:
                return get_release_type(db_release)
            return None

    @strawberry.field
    def step_labels(self) -> typing.List[str]:
        return STEP_LABELS

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_release(self, name: str, date: str, additional_info: typing.Optional[str] = None) -> Release:
        with get_db() as db:
            db_release = ReleaseModel(
                name=name,
                date=date,
                additional_info=additional_info,
                steps=[False] * 8
            )
            db.add(db_release)
            db.commit()
            db.refresh(db_release)
            return get_release_type(db_release)

    @strawberry.mutation
    def delete_release(self, id: int) -> bool:
        with get_db() as db:
            db_release = db.query(ReleaseModel).filter(ReleaseModel.id == id).first()
            if db_release:
                db.delete(db_release)
                db.commit()
                return True
            return False

    @strawberry.mutation
    def toggle_step(self, release_id: int, step_index: int) -> Release:
        if step_index < 0 or step_index > 7:
            raise ValueError("stepIndex must be between 0 and 7")
            
        with get_db() as db:
            db_release = db.query(ReleaseModel).filter(ReleaseModel.id == release_id).first()
            if not db_release:
                raise ValueError("Release not found")
                
            new_steps = list(db_release.steps)
            new_steps[step_index] = not new_steps[step_index]
            db_release.steps = new_steps
            
            db.commit()
            db.refresh(db_release)
            return get_release_type(db_release)

    @strawberry.mutation
    def update_additional_info(self, release_id: int, info: str) -> Release:
        with get_db() as db:
            db_release = db.query(ReleaseModel).filter(ReleaseModel.id == release_id).first()
            if not db_release:
                raise ValueError("Release not found")
                
            db_release.additional_info = info
            db.commit()
            db.refresh(db_release)
            return get_release_type(db_release)

schema = strawberry.Schema(query=Query, mutation=Mutation)
