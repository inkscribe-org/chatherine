from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from sqlalchemy import Column, Integer, String, select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


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


engine = create_async_engine("sqlite+aiosqlite:///./customers.db", echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

app = FastAPI(title="Simple API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
