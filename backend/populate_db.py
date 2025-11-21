import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from main import (
    Base,
    Customer,
    Service,
    InventoryItem,
    Appointment,
    Invoice,
    BusinessHours,
    Policy,
    Log,
)
from datetime import datetime, timedelta
import random


async def populate_database():
    engine = create_async_engine("sqlite+aiosqlite:///./customers.db", echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Create dummy customers
        customers = [
            Customer(
                name="John Doe",
                email="john@example.com",
                phone="+1234567890",
                business_name="Doe Enterprises",
                business_type="Consulting",
                business_address="123 Main St",
            ),
            Customer(
                name="Jane Smith",
                email="jane@example.com",
                phone="+1234567891",
                business_name="Smith Co",
                business_type="Retail",
                business_address="456 Oak Ave",
            ),
            Customer(
                name="Bob Johnson",
                email="bob@example.com",
                phone="+1234567892",
                business_name="Johnson LLC",
                business_type="Services",
                business_address="789 Pine Rd",
            ),
            Customer(
                name="Alice Brown",
                email="alice@example.com",
                phone="+1234567893",
                business_name="Brown Corp",
                business_type="Manufacturing",
                business_address="321 Elm St",
            ),
            Customer(
                name="Charlie Wilson",
                email="charlie@example.com",
                phone="+1234567894",
                business_name="Wilson Inc",
                business_type="Technology",
                business_address="654 Maple Dr",
            ),
        ]
        session.add_all(customers)
        await session.commit()

        # Create dummy services
        services = [
            Service(
                customer_id=1,
                name="Consultation",
                description="Initial business consultation",
                price=150.0,
                duration=60,
            ),
            Service(
                customer_id=1,
                name="Facial Treatment",
                description="Premium facial care",
                price=100.0,
                duration=45,
            ),
            Service(
                customer_id=2,
                name="Deep Tissue Massage",
                description="Therapeutic massage",
                price=120.0,
                duration=60,
            ),
            Service(
                customer_id=2,
                name="Hair Styling",
                description="Professional hair styling",
                price=80.0,
                duration=30,
            ),
            Service(
                customer_id=3,
                name="Manicure",
                description="Nail care service",
                price=50.0,
                duration=30,
            ),
        ]
        session.add_all(services)
        await session.commit()

        # Create dummy inventory
        inventory = [
            InventoryItem(
                customer_id=1,
                name="Facial Cream",
                quantity=25,
                price=25.0,
                category="Skincare",
            ),
            InventoryItem(
                customer_id=1,
                name="Massage Oil",
                quantity=15,
                price=30.0,
                category="Wellness",
            ),
            InventoryItem(
                customer_id=2,
                name="Hair Shampoo",
                quantity=40,
                price=15.0,
                category="Hair Care",
            ),
            InventoryItem(
                customer_id=2,
                name="Nail Polish",
                quantity=50,
                price=8.0,
                category="Nails",
            ),
            InventoryItem(
                customer_id=3,
                name="Towels",
                quantity=100,
                price=5.0,
                category="Supplies",
            ),
        ]
        session.add_all(inventory)
        await session.commit()

        # Create dummy appointments
        appointments = [
            Appointment(
                customer_id=1,
                service_id=1,
                date="2024-12-01",
                time="10:00",
                status="scheduled",
                notes="Initial consultation",
            ),
            Appointment(
                customer_id=2,
                service_id=2,
                date="2024-12-01",
                time="14:00",
                status="confirmed",
                notes="Regular facial",
            ),
            Appointment(
                customer_id=3,
                service_id=3,
                date="2024-12-02",
                time="11:00",
                status="scheduled",
                notes="Deep tissue session",
            ),
            Appointment(
                customer_id=4,
                service_id=4,
                date="2024-12-02",
                time="15:30",
                status="confirmed",
                notes="Hair styling appointment",
            ),
            Appointment(
                customer_id=5,
                service_id=5,
                date="2024-12-03",
                time="13:00",
                status="scheduled",
                notes="Manicure service",
            ),
        ]
        session.add_all(appointments)
        await session.commit()

        # Create dummy invoices
        today = datetime.now().date().isoformat()
        invoices = [
            Invoice(
                customer_id=1,
                appointment_id=1,
                total_amount=150.0,
                status="paid",
                created_date=today,
                due_date="2024-12-01",
                items='[{"service": "Consultation", "price": 150.0}]',
            ),
            Invoice(
                customer_id=2,
                appointment_id=2,
                total_amount=100.0,
                status="unpaid",
                created_date=today,
                due_date="2024-12-01",
                items='[{"service": "Facial Treatment", "price": 100.0}]',
            ),
            Invoice(
                customer_id=3,
                appointment_id=3,
                total_amount=120.0,
                status="paid",
                created_date=today,
                due_date="2024-12-02",
                items='[{"service": "Deep Tissue Massage", "price": 120.0}]',
            ),
            Invoice(
                customer_id=4,
                appointment_id=4,
                total_amount=80.0,
                status="unpaid",
                created_date=today,
                due_date="2024-12-02",
                items='[{"service": "Hair Styling", "price": 80.0}]',
            ),
            Invoice(
                customer_id=5,
                appointment_id=5,
                total_amount=50.0,
                status="paid",
                created_date=today,
                due_date="2024-12-03",
                items='[{"service": "Manicure", "price": 50.0}]',
            ),
        ]
        session.add_all(invoices)
        await session.commit()

        # Create dummy business hours
        business_hours = [
            BusinessHours(
                customer_id=1,
                day_of_week=0,
                open_time="09:00",
                close_time="17:00",
                is_closed=False,
            ),  # Monday
            BusinessHours(
                customer_id=1,
                day_of_week=1,
                open_time="09:00",
                close_time="17:00",
                is_closed=False,
            ),  # Tuesday
            BusinessHours(
                customer_id=1,
                day_of_week=2,
                open_time="09:00",
                close_time="17:00",
                is_closed=False,
            ),  # Wednesday
            BusinessHours(
                customer_id=1,
                day_of_week=3,
                open_time="09:00",
                close_time="17:00",
                is_closed=False,
            ),  # Thursday
            BusinessHours(
                customer_id=1,
                day_of_week=4,
                open_time="09:00",
                close_time="16:00",
                is_closed=False,
            ),  # Friday
            BusinessHours(
                customer_id=1,
                day_of_week=5,
                open_time="10:00",
                close_time="15:00",
                is_closed=False,
            ),  # Saturday
            BusinessHours(
                customer_id=1,
                day_of_week=6,
                open_time="00:00",
                close_time="00:00",
                is_closed=True,
            ),  # Sunday
        ]
        session.add_all(business_hours)
        await session.commit()

        # Create dummy policies
        policies = [
            Policy(
                customer_id=1,
                title="Refund Policy",
                content="We offer full refunds within 30 days of purchase for unused services.",
                category="refund",
            ),
            Policy(
                customer_id=1,
                title="Cancellation Policy",
                content="Please provide 24 hours notice for cancellations.",
                category="general",
            ),
            Policy(
                customer_id=1,
                title="Privacy Policy",
                content="We respect your privacy and protect your personal information.",
                category="privacy",
            ),
            Policy(
                customer_id=1,
                title="Terms of Service",
                content="By using our services, you agree to our terms and conditions.",
                category="terms",
            ),
            Policy(
                customer_id=1,
                title="Appointment Policy",
                content="Late arrivals may result in shortened appointments.",
                category="general",
            ),
        ]
        session.add_all(policies)
        await session.commit()

        # Create dummy logs
        logs = [
            Log(
                customer_id=1,
                timestamp=datetime.now().isoformat(),
                action="customer_created",
                details="Created customer John Doe",
            ),
            Log(
                customer_id=1,
                timestamp=datetime.now().isoformat(),
                action="service_created",
                details="Created service Consultation",
            ),
            Log(
                customer_id=1,
                timestamp=datetime.now().isoformat(),
                action="appointment_booked",
                details="Booked appointment for John Doe",
            ),
            Log(
                customer_id=1,
                timestamp=datetime.now().isoformat(),
                action="invoice_generated",
                details="Generated invoice for consultation",
            ),
            Log(
                customer_id=1,
                timestamp=datetime.now().isoformat(),
                action="hours_updated",
                details="Updated business hours",
            ),
        ]
        session.add_all(logs)
        await session.commit()

    print("Database populated with dummy data!")


if __name__ == "__main__":
    asyncio.run(populate_database())
