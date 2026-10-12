from fastapi import FastAPI

app = FastAPI(title="ABC Restaurant API")

@app.get("/")
async def root():
    return {"message": "API Running"}
