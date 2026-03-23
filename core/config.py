from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    project_name: str = "CV Tailor API"
    database_url: str = "sqlite:///./cv_tailor.db"
    gemini_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
