from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app import crud, schemas
from app.api import deps
from app.db.base import Base
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite+pysqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    future=True,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def _get_test_db() -> Generator[Session, None, None]:
        try:
            yield db_session
            db_session.commit()
        finally:
            db_session.rollback()

    app.dependency_overrides[deps.get_db_session] = _get_test_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def superuser_token(db_session: Session) -> str:
    user_in = schemas.UserCreate(
        email="admin@example.com",
        password="supersecret",
        full_name="Admin User",
        is_active=True,
        is_superuser=True,
    )
    user = crud.user.get_by_email(db_session, email=user_in.email)
    if not user:
        user = crud.user.create(db_session, obj_in=user_in)
    return f"Bearer {user.email}"


@pytest.fixture()
def normal_user_token(db_session: Session) -> str:
    user_in = schemas.UserCreate(
        email="user@example.com",
        password="password123",
        full_name="Normal User",
        is_active=True,
        is_superuser=False,
    )
    user = crud.user.get_by_email(db_session, email=user_in.email)
    if not user:
        user = crud.user.create(db_session, obj_in=user_in)
    return f"Bearer {user.email}"
