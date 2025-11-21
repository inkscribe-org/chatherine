from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Simple API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None


items = [
    Item(id=1, name="First Item", description="This is the first item"),
    Item(id=2, name="Second Item", description="This is the second item"),
]


@app.get("/")
async def root():
    return {"message": "Welcome to Simple API"}


@app.get("/api/items", response_model=List[Item])
async def get_items():
    return items


@app.get("/api/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    for item in items:
        if item.id == item_id:
            return item
    return {"error": "Item not found"}


@app.post("/api/items", response_model=Item)
async def create_item(item: Item):
    item.id = len(items) + 1
    items.append(item)
    return item


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
