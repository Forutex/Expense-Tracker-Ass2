from models import UserActivity


def log_activity(db, user_id: int, action: str, detail: str = ""):
    activity = UserActivity(
        user_id=user_id,
        action=action,
        detail=detail
    )

    db.add(activity)