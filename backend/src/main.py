from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.init import cmc_client
from src.router import router as router_crypto


@asynccontextmanager
async def lifespan(app: FastAPI):
    await cmc_client.start()
    yield
    await cmc_client.close()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_crypto)

@app.get("/")
async def root():
    return {"message": "API is running"}