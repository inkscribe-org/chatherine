from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from sqlalchemy import Column, Integer, String, select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
import os
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from dotenv import load_dotenv

load_dotenv()

class Base(DeclarativeBase):
    pass


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    phone: Mapped[Optional[str]] = mapped_column()
    business_name: Mapped[Optional[str]] = mapped_column()
    business_type: Mapped[Optional[str]] = mapped_column()
    business_address: Mapped[Optional[str]] = mapped_column()


class Log(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    timestamp: Mapped[str] = mapped_column()
    action: Mapped[str] = mapped_column()
    details: Mapped[Optional[str]] = mapped_column()


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[Optional[str]] = mapped_column()
    price: Mapped[float] = mapped_column()
    duration: Mapped[Optional[int]] = mapped_column()  # in minutes


class InventoryItem(Base):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(index=True)
    quantity: Mapped[int] = mapped_column()
    price: Mapped[float] = mapped_column()
    category: Mapped[Optional[str]] = mapped_column()


engine = create_async_engine("sqlite+aiosqlite:///./customers.db", echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

app = FastAPI(title="Simple API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Watsonx AI setup
dallas = os.environ.get("dallas")
apikey = os.environ.get("apikey")
pid = os.environ.get("pid")
model_id = "ibm/granite-3-8b-instruct"


@app.on_event("startup")
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


class CustomerModel(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = None
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_address: Optional[str] = None


class LogModel(BaseModel):
    id: Optional[int] = None
    timestamp: str
    action: str
    details: Optional[str] = None


class ServiceModel(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    duration: Optional[int] = None


class InventoryModel(BaseModel):
    id: Optional[int] = None
    name: str
    quantity: int
    price: float
    category: Optional[str] = None


class ChatMessage(BaseModel):
    message: str


@app.get("/")
async def root():
    return {"message": "Welcome to Simple API"}


@app.get("/api/customers", response_model=List[CustomerModel])
async def get_customers():
    async with async_session() as session:
        result = await session.execute(select(Customer))
        customers = result.scalars().all()
        return customers


@app.get("/api/customers/{customer_id}", response_model=CustomerModel)
async def get_customer(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Customer).where(Customer.id == customer_id)
        )
        customer = result.scalar_one_or_none()
        if customer:
            return customer
        return {"error": "Customer not found"}


@app.post("/api/customers", response_model=CustomerModel)
async def create_customer(customer: CustomerModel):
    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        business_name=customer.business_name,
        business_type=customer.business_type,
        business_address=customer.business_address,
    )
    async with async_session() as session:
        session.add(new_customer)
        await session.commit()
        await session.refresh(new_customer)
        return new_customer


@app.get("/api/logs", response_model=List[LogModel])
async def get_logs():
    async with async_session() as session:
        result = await session.execute(select(Log))
        logs = result.scalars().all()
        return logs


@app.get("/api/services", response_model=List[ServiceModel])
async def get_services():
    async with async_session() as session:
        result = await session.execute(select(Service))
        services = result.scalars().all()
        return services


@app.post("/api/services", response_model=ServiceModel)
async def create_service(service: ServiceModel):
    new_service = Service(
        name=service.name,
        description=service.description,
        price=service.price,
        duration=service.duration,
    )
    async with async_session() as session:
        session.add(new_service)
        await session.commit()
        await session.refresh(new_service)
        return new_service


@app.get("/api/inventory", response_model=List[InventoryModel])
async def get_inventory():
    async with async_session() as session:
        result = await session.execute(select(InventoryItem))
        inventory = result.scalars().all()
        return inventory


@app.post("/api/inventory", response_model=InventoryModel)
async def create_inventory_item(item: InventoryModel):
    new_item = InventoryItem(
        name=item.name,
        quantity=item.quantity,
        price=item.price,
        category=item.category,
    )
    async with async_session() as session:
        session.add(new_item)
        await session.commit()
        await session.refresh(new_item)
        return new_item


@app.post("/api/chat")
async def chat(chat_message: ChatMessage):
    response_text = ""
    if not dallas or not apikey or not pid:
        # Mock response for testing
        response_text = f"Got it! I've processed your request: '{chat_message.message}'. This is a mock response since LLM credentials are not configured."
    else:
        try:
            credentials = Credentials(
                url=dallas,
                api_key=apikey,
            )
            from ibm_watsonx_ai import APIClient

            client = APIClient(credentials)
            params = {"time_limit": 10000, "max_tokens": 256}
            model = ModelInference(
                model_id=model_id,
                api_client=client,
                project_id=pid,
                params=params,
                space_id=None,
                verify=False,
            )

            messages = [
                {
                    "role": "system",
                    "content": "You are a helpful assistant for managing a business. You can help with updating services, scheduling, customer management, and other business operations.",
                },
                {
                    "role": "user",
                    "content": [{"type": "text", "text": chat_message.message}],
                },
            ]
            response = model.chat(messages=messages)
            response_text = response["choices"][0]["message"]["content"]
        except Exception as e:
            response_text = f"Got it! I've processed your request: '{chat_message.message}'. This is a mock response since LLM credentials are invalid or not configured. Error: {str(e)}"

    # Log the action
    from datetime import datetime

    log_entry = Log(
        timestamp=datetime.now().isoformat(),
        action="chat",
        details=f"Message: {chat_message.message}, Response: {response_text}",
    )
    async with async_session() as session:
        session.add(log_entry)
        await session.commit()

    return {"response": response_text}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
