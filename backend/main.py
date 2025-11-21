from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from sqlalchemy import Column, Integer, String, select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
import os
from langchain_ibm import ChatWatsonx
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool
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
    telegram_id: Mapped[Optional[str]] = mapped_column(unique=True, index=True)


class Log(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[Optional[int]] = mapped_column(index=True)
    timestamp: Mapped[str] = mapped_column()
    action: Mapped[str] = mapped_column()
    details: Mapped[Optional[str]] = mapped_column()


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[Optional[str]] = mapped_column()
    price: Mapped[float] = mapped_column()
    duration: Mapped[Optional[int]] = mapped_column()  # in minutes


class InventoryItem(Base):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    name: Mapped[str] = mapped_column(index=True)
    quantity: Mapped[int] = mapped_column()
    price: Mapped[float] = mapped_column()
    category: Mapped[Optional[str]] = mapped_column()


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    service_id: Mapped[int] = mapped_column(index=True)
    date: Mapped[str] = mapped_column()  # ISO format
    time: Mapped[str] = mapped_column()  # HH:MM format
    status: Mapped[str] = mapped_column(
        default="scheduled"
    )  # scheduled, completed, cancelled
    notes: Mapped[Optional[str]] = mapped_column()


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    appointment_id: Mapped[Optional[int]] = mapped_column()
    total_amount: Mapped[float] = mapped_column()
    status: Mapped[str] = mapped_column(default="unpaid")  # unpaid, paid, overdue
    created_date: Mapped[str] = mapped_column()
    due_date: Mapped[str] = mapped_column()
    items: Mapped[Optional[str]] = mapped_column()  # JSON string of items


class BusinessHours(Base):
    __tablename__ = "business_hours"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    day_of_week: Mapped[int] = mapped_column()  # 0=Monday, 6=Sunday
    open_time: Mapped[str] = mapped_column()  # HH:MM
    close_time: Mapped[str] = mapped_column()  # HH:MM
    is_closed: Mapped[bool] = mapped_column(default=False)


class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    title: Mapped[str] = mapped_column()
    content: Mapped[str] = mapped_column()
    category: Mapped[str] = mapped_column()  # e.g., "refund", "privacy", "terms"


class BusinessFact(Base):
    __tablename__ = "business_facts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    title: Mapped[str] = mapped_column()
    content: Mapped[str] = mapped_column()
    category: Mapped[str] = (
        mapped_column()
    )  # e.g., "general", "services", "location", "hours"
    is_public: Mapped[bool] = mapped_column(
        default=True
    )  # Whether customers can see this


class BusinessService(Base):
    __tablename__ = "business_services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    name: Mapped[str] = (
        mapped_column()
    )  # Service name (e.g., "Haircut", "Math Tutoring", "Pizza Margherita")
    description: Mapped[Optional[str]] = mapped_column()  # Optional description
    category: Mapped[str] = (
        mapped_column()
    )  # e.g., "food", "service", "tutoring", "product"
    price: Mapped[Optional[float]] = mapped_column()  # Optional price
    duration: Mapped[Optional[str]] = mapped_column()  # e.g., "30 min", "2 hours"
    is_available: Mapped[bool] = mapped_column(
        default=True
    )  # Whether currently offered
    custom_data: Mapped[Optional[str]] = (
        mapped_column()
    )  # JSON string for flexible additional data


class UnansweredQuestion(Base):
    __tablename__ = "unanswered_questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(index=True)
    question: Mapped[str] = mapped_column()
    timestamp: Mapped[str] = mapped_column()
    status: Mapped[str] = mapped_column(default="pending")  # pending, answered, ignored
    response: Mapped[Optional[str]] = mapped_column()  # Owner's response when answered


engine = create_async_engine("sqlite+aiosqlite:///./customers.db", echo=True)
async_session = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

app = FastAPI(title="Simple API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Watson X AI setup
watsonx_api_key = os.environ.get("WATSONX_API_KEY")


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
    telegram_id: Optional[str] = None


class LogModel(BaseModel):
    id: Optional[int] = None
    timestamp: str
    action: str
    details: Optional[str] = None


class ServiceModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    name: str
    description: Optional[str] = None
    price: float
    duration: Optional[int] = None


class InventoryModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    name: str
    quantity: int
    price: float
    category: Optional[str] = None


class AppointmentModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    service_id: int
    date: str
    time: str
    status: str = "scheduled"
    notes: Optional[str] = None


class InvoiceModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    appointment_id: Optional[int] = None
    total_amount: float
    status: str = "unpaid"
    created_date: str
    due_date: str
    items: Optional[str] = None


class BusinessHoursModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    day_of_week: int
    open_time: str
    close_time: str
    is_closed: bool = False


class PolicyModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    title: str
    content: str
    category: str


class BusinessFactModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    title: str
    content: str
    category: str
    is_public: bool = True


class BusinessServiceModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    name: str
    description: Optional[str] = None
    category: str
    price: Optional[float] = None
    duration: Optional[str] = None
    is_available: bool = True
    custom_data: Optional[str] = None


class UnansweredQuestionModel(BaseModel):
    id: Optional[int] = None
    customer_id: int
    question: str
    timestamp: str
    status: str = "pending"
    response: Optional[str] = None


class ChatMessage(BaseModel):
    message: str
    customer_id: Optional[int] = None
    api_key: Optional[str] = None
    api_key: Optional[str] = None


# Tool functions for LLM
@tool
async def get_customer_services(customer_id: int) -> str:
    """Get the list of services for a customer."""
    async with async_session() as session:
        result = await session.execute(
            select(Service).where(Service.customer_id == customer_id)
        )
        services = result.scalars().all()
        if not services:
            return "No services found."
        service_list = "\n".join(
            [f"- {s.name}: ${s.price} ({s.duration} min)" for s in services]
        )
        return f"Services:\n{service_list}"


@tool
async def get_customer_schedule(customer_id: int) -> str:
    """Get the complete schedule for a customer including appointments and business hours."""
    schedule_parts = []

    # Get business hours
    async with async_session() as session:
        hours_result = await session.execute(
            select(BusinessHours).where(BusinessHours.customer_id == customer_id)
        )
        hours = hours_result.scalars().all()

        if hours:
            days = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ]
            hours_list = []
            for h in hours:
                day_name = days[h.day_of_week]
                if h.is_closed:
                    hours_list.append(f"  {day_name}: Closed")
                else:
                    hours_list.append(f"  {day_name}: {h.open_time} - {h.close_time}")
            schedule_parts.append(f"🕒 **Business Hours:**\n" + "\n".join(hours_list))

    # Get appointments
    async with async_session() as session:
        appt_result = await session.execute(
            select(Appointment)
            .where(Appointment.customer_id == customer_id)
            .order_by(Appointment.date, Appointment.time)
        )
        appointments = appt_result.scalars().all()

        if appointments:
            appt_list = []
            for a in appointments:
                status_emoji = {
                    "scheduled": "📅",
                    "completed": "✅",
                    "cancelled": "❌",
                }.get(a.status, "❓")
                appt_list.append(
                    f"  {status_emoji} {a.date} {a.time}: {a.status.title()} ({a.notes or 'No notes'})"
                )
            schedule_parts.append(f"📋 **Appointments:**\n" + "\n".join(appt_list))
        else:
            schedule_parts.append("📋 **Appointments:** No appointments scheduled")

    return (
        "\n\n".join(schedule_parts)
        if schedule_parts
        else "No schedule information available."
    )


@tool
async def get_customer_appointments(customer_id: int) -> str:
    """Get the list of appointments for a customer."""
    async with async_session() as session:
        result = await session.execute(
            select(Appointment)
            .where(Appointment.customer_id == customer_id)
            .order_by(Appointment.date, Appointment.time)
        )
        appointments = result.scalars().all()
        if not appointments:
            return "No appointments found."
        appt_list = "\n".join(
            [
                f"- {a.date} {a.time}: {a.status.title()} ({a.notes or 'No notes'})"
                for a in appointments
            ]
        )
        return f"📅 **Your Appointments:**\n{appt_list}"


@tool
async def get_customer_revenue(customer_id: int, date: str = "today") -> str:
    """Get revenue information for a customer on a specific date."""
    from datetime import datetime, timedelta

    if date == "today":
        today = datetime.now().date()
        start_date = today.isoformat()
        end_date = (today + timedelta(days=1)).isoformat()
    else:
        start_date = date
        end_date = (datetime.fromisoformat(date) + timedelta(days=1)).isoformat()

    async with async_session() as session:
        result = await session.execute(
            select(Invoice).where(
                Invoice.customer_id == customer_id,
                Invoice.status == "paid",
                Invoice.created_date >= start_date,
                Invoice.created_date < end_date,
            )
        )
        invoices = result.scalars().all()
        total_revenue = sum(invoice.total_amount for invoice in invoices)
        return f"Revenue on {date}: ${total_revenue} from {len(invoices)} invoices."


@tool
async def get_customer_business_hours(customer_id: int) -> str:
    """Get business hours for a customer."""
    async with async_session() as session:
        result = await session.execute(
            select(BusinessHours).where(BusinessHours.customer_id == customer_id)
        )
        hours = result.scalars().all()
        if not hours:
            return "No business hours set."
        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        hours_list = []
        for h in hours:
            day_name = days[h.day_of_week]
            if h.is_closed:
                hours_list.append(f"- {day_name}: Closed")
            else:
                hours_list.append(f"- {day_name}: {h.open_time} - {h.close_time}")
        return f"Business Hours:\n" + "\n".join(hours_list)


@tool
async def get_customer_inventory(customer_id: int) -> str:
    """Get inventory items for a customer."""
    async with async_session() as session:
        result = await session.execute(
            select(InventoryItem).where(InventoryItem.customer_id == customer_id)
        )
        items = result.scalars().all()
        if not items:
            return "No inventory items found."
        item_list = "\n".join(
            [
                f"- {i.name}: {i.quantity} units @ ${i.price} each ({i.category or 'No category'})"
                for i in items
            ]
        )
        return f"Inventory:\n{item_list}"


@tool
async def get_all_customers() -> str:
    """Get a list of all customers in the system."""
    async with async_session() as session:
        result = await session.execute(select(Customer))
        customers = result.scalars().all()
        if not customers:
            return "No customers found."
        customer_list = []
        for c in customers:
            business_info = f" - {c.business_name}" if c.business_name else ""
            customer_list.append(f"- **{c.name}** ({c.email}){business_info}")
        return f"**All Customers:**\n" + "\n".join(customer_list)


@tool
async def get_customer_business_facts(customer_id: int) -> str:
    """Get public business facts and information for a customer."""
    async with async_session() as session:
        result = await session.execute(
            select(BusinessFact).where(
                BusinessFact.customer_id == customer_id, BusinessFact.is_public == True
            )
        )
        facts = result.scalars().all()
        if not facts:
            return "No business information available."
        fact_list = []
        for f in facts:
            fact_list.append(f"**{f.title}:**\n{f.content}")
        return f"**Business Information:**\n\n" + "\n\n".join(fact_list)


@tool
async def search_business_facts(customer_id: int, query: str) -> str:
    """Search business facts for specific information using keywords."""
    async with async_session() as session:
        result = await session.execute(
            select(BusinessFact).where(
                BusinessFact.customer_id == customer_id, BusinessFact.is_public == True
            )
        )
        facts = result.scalars().all()

        if not facts:
            return "No business information available to search."

        # Simple keyword search in titles and content
        query_lower = query.lower()
        matching_facts = []

        for f in facts:
            if (
                query_lower in f.title.lower()
                or query_lower in f.content.lower()
                or query_lower in f.category.lower()
            ):
                matching_facts.append(f)

        if not matching_facts:
            return f"No information found for '{query}'. Available topics: {', '.join([f.title for f in facts])}"

        fact_list = []
        for f in matching_facts:
            fact_list.append(f"**{f.title}:**\n{f.content}")
        return f"**Search Results for '{query}':**\n\n" + "\n\n".join(fact_list)


@tool
async def add_business_fact(
    customer_id: int, title: str, content: str, category: str = "general"
) -> str:
    """Add a new business fact to the knowledge base. Use this when customers provide new information about the business that should be stored for future reference."""
    try:
        async with async_session() as session:
            new_fact = BusinessFact(
                customer_id=customer_id,
                title=title,
                content=content,
                category=category,
                is_public=True,
            )
            session.add(new_fact)
            await session.commit()
            await session.refresh(new_fact)
            return f"✅ Successfully stored: **{title}**\n{content}"
    except Exception as e:
        return f"❌ Failed to store business fact: {str(e)}"


@tool
async def store_unanswered_question(customer_id: int, question: str) -> str:
    """Store an unanswered customer question for the business owner to review and respond to manually."""
    try:
        from datetime import datetime

        async with async_session() as session:
            unanswered_question = UnansweredQuestion(
                customer_id=customer_id,
                question=question,
                timestamp=datetime.now().isoformat(),
                status="pending",
            )
            session.add(unanswered_question)
            await session.commit()
            await session.refresh(unanswered_question)
            return f"📝 Question stored for owner review: '{question}'"
    except Exception as e:
        return f"❌ Failed to store unanswered question: {str(e)}"


@tool
async def list_business_services(customer_id: int) -> str:
    """Get all available business services and offerings."""
    async with async_session() as session:
        result = await session.execute(
            select(BusinessService).where(
                BusinessService.customer_id == customer_id,
                BusinessService.is_available == True,
            )
        )
        services = result.scalars().all()
        if not services:
            return "No services are currently available."

        # Group services by category
        categories = {}
        for service in services:
            if service.category not in categories:
                categories[service.category] = []
            categories[service.category].append(service)

        response_parts = []
        for category, service_list in categories.items():
            response_parts.append(f"**{category.title()} Services:**")
            for service in service_list:
                price_info = f" - ${service.price}" if service.price else ""
                duration_info = f" ({service.duration})" if service.duration else ""
                desc_info = f" - {service.description}" if service.description else ""
                response_parts.append(
                    f"• **{service.name}**{price_info}{duration_info}{desc_info}"
                )
            response_parts.append("")  # Empty line between categories

        return "\n".join(response_parts).strip()


@tool
async def search_business_services(customer_id: int, query: str) -> str:
    """Search for specific business services by name or description."""
    async with async_session() as session:
        result = await session.execute(
            select(BusinessService).where(
                BusinessService.customer_id == customer_id,
                BusinessService.is_available == True,
            )
        )
        services = result.scalars().all()

        if not services:
            return "No services are currently available."

        # Simple keyword search
        query_lower = query.lower()
        matching_services = []

        for service in services:
            if (
                query_lower in service.name.lower()
                or (service.description and query_lower in service.description.lower())
                or query_lower in service.category.lower()
            ):
                matching_services.append(service)

        if not matching_services:
            return f"No services found matching '{query}'. Available categories: {', '.join(set(s.category for s in services))}"

        response_parts = [f"**Services matching '{query}':**"]
        for service in matching_services:
            price_info = f" - ${service.price}" if service.price else ""
            duration_info = f" ({service.duration})" if service.duration else ""
            desc_info = f"\n  {service.description}" if service.description else ""
            response_parts.append(
                f"• **{service.name}**{price_info}{duration_info}{desc_info}"
            )

        return "\n".join(response_parts)


@tool
async def add_business_service(
    customer_id: int,
    name: str,
    category: str,
    description: Optional[str] = None,
    price: Optional[float] = None,
    duration: Optional[str] = None,
) -> str:
    """Add a new business service or offering."""
    try:
        async with async_session() as session:
            new_service = BusinessService(
                customer_id=customer_id,
                name=name,
                description=description,
                category=category,
                price=price,
                duration=duration,
                is_available=True,
            )
            session.add(new_service)
            await session.commit()
            await session.refresh(new_service)

            price_info = f" at ${price}" if price else ""
            duration_info = f" ({duration})" if duration else ""
            return (
                f"✅ Successfully added service: **{name}**{price_info}{duration_info}"
            )
    except Exception as e:
        return f"❌ Failed to add service: {str(e)}"


@tool
async def update_service_price_chat(
    customer_id: int,
    service_name: str,
    new_price: float,
) -> str:
    """Update price of an existing service."""
    try:
        async with async_session() as session:
            # Find service by name
            result = await session.execute(
                select(BusinessService).where(
                    BusinessService.customer_id == customer_id,
                    BusinessService.name == service_name,
                    BusinessService.is_available == True,
                )
            )
            service = result.scalar_one_or_none()

            if not service:
                return f"❌ Service '{service_name}' not found. Available services: {await list_business_services(customer_id)}"

            old_price = service.price
            service.price = new_price
            await session.commit()
            await session.refresh(service)

            return f"✅ Updated **{service_name}** price: ${old_price} → ${new_price}"
    except Exception as e:
        return f"❌ Failed to update service price: {str(e)}"


@tool
async def update_business_description_chat(
    customer_id: int,
    description: str,
) -> str:
    """Update the business description."""
    try:
        async with async_session() as session:
            # Check if business description fact exists
            result = await session.execute(
                select(BusinessFact).where(
                    BusinessFact.customer_id == customer_id,
                    BusinessFact.category == "general",
                    BusinessFact.title == "Business Description",
                )
            )
            existing_fact = result.scalar_one_or_none()

            if existing_fact:
                # Update existing description
                existing_fact.content = description
                await session.commit()
                await session.refresh(existing_fact)
                return f"✅ Updated business description"
            else:
                # Create new description fact
                new_fact = BusinessFact(
                    customer_id=customer_id,
                    title="Business Description",
                    content=description,
                    category="general",
                    is_public=True,
                )
                session.add(new_fact)
                await session.commit()
                await session.refresh(new_fact)
                return f"✅ Set business description"
    except Exception as e:
        return f"❌ Failed to update business description: {str(e)}"


@tool
async def update_business_location_chat(
    customer_id: int,
    address: str,
    service_areas: Optional[str] = None,
) -> str:
    """Update business location and service areas."""
    try:
        async with async_session() as session:
            # Update location fact
            location_result = await session.execute(
                select(BusinessFact).where(
                    BusinessFact.customer_id == customer_id,
                    BusinessFact.category == "location",
                    BusinessFact.title == "Address",
                )
            )
            location_fact = location_result.scalar_one_or_none()

            if location_fact:
                location_fact.content = address
                await session.commit()
                await session.refresh(location_fact)
            else:
                location_fact = BusinessFact(
                    customer_id=customer_id,
                    title="Address",
                    content=address,
                    category="location",
                    is_public=True,
                )
                session.add(location_fact)

            # Update service areas if provided
            if service_areas:
                areas_result = await session.execute(
                    select(BusinessFact).where(
                        BusinessFact.customer_id == customer_id,
                        BusinessFact.category == "location",
                        BusinessFact.title == "Service Areas",
                    )
                )
                areas_fact = areas_result.scalar_one_or_none()

                if areas_fact:
                    areas_fact.content = service_areas
                    await session.commit()
                    await session.refresh(areas_fact)
                else:
                    areas_fact = BusinessFact(
                        customer_id=customer_id,
                        title="Service Areas",
                        content=service_areas,
                        category="location",
                        is_public=True,
                    )
                    session.add(areas_fact)

            await session.commit()
            response = f"✅ Updated business address: **{address}**"
            if service_areas:
                response += f"\n✅ Updated service areas: **{service_areas}**"
            return response
    except Exception as e:
        return f"❌ Failed to update business location: {str(e)}"


@tool
async def add_staff_member_chat(
    customer_id: int,
    name: str,
    role: str,
    availability: Optional[str] = None,
) -> str:
    """Add a new staff member."""
    try:
        async with async_session() as session:
            # Create staff member as a business fact
            staff_fact = BusinessFact(
                customer_id=customer_id,
                title=f"Staff: {name}",
                content=f"Role: {role}"
                + (f"\nAvailability: {availability}" if availability else ""),
                category="staff",
                is_public=True,
            )
            session.add(staff_fact)
            await session.commit()
            await session.refresh(staff_fact)

            availability_info = (
                f" with availability: {availability}" if availability else ""
            )
            return f"✅ Added staff member: **{name}** as **{role}**{availability_info}"
    except Exception as e:
        return f"❌ Failed to add staff member: {str(e)}"


@tool
async def update_appointment_availability_chat(
    customer_id: int,
    date: str,
    is_available: bool,
    reason: Optional[str] = None,
) -> str:
    """Update appointment availability for a specific date."""
    try:
        async with async_session() as session:
            # Create availability fact
            status = "available" if is_available else "unavailable"
            content = f"Date: {date}\nStatus: {status}"
            if reason:
                content += f"\nReason: {reason}"

            availability_fact = BusinessFact(
                customer_id=customer_id,
                title=f"Availability: {date}",
                content=content,
                category="availability",
                is_public=True,
            )
            session.add(availability_fact)
            await session.commit()
            await session.refresh(availability_fact)

            reason_info = f" ({reason})" if reason else ""
            return f"✅ Updated availability for {date}: **{status}**{reason_info}"
    except Exception as e:
        return f"❌ Failed to update appointment availability: {str(e)}"


@tool
async def update_business_hours(
    customer_id: int,
    day_of_week: int,
    open_time: Optional[str] = None,
    close_time: Optional[str] = None,
    is_closed: Optional[bool] = None,
) -> str:
    """Update business hours for a specific day."""
    try:
        async with async_session() as session:
            # Check if hours exist for this day
            result = await session.execute(
                select(BusinessHours).where(
                    BusinessHours.customer_id == customer_id,
                    BusinessHours.day_of_week == day_of_week,
                )
            )
            existing_hours = result.scalar_one_or_none()

            days = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ]
            day_name = days[day_of_week]

            if existing_hours:
                # Update existing hours
                if open_time is not None:
                    existing_hours.open_time = open_time
                if close_time is not None:
                    existing_hours.close_time = close_time
                if is_closed is not None:
                    existing_hours.is_closed = is_closed

                await session.commit()
                await session.refresh(existing_hours)

                if existing_hours.is_closed:
                    return f"✅ Updated {day_name}: **Closed**"
                else:
                    return f"✅ Updated {day_name}: **{existing_hours.open_time} - {existing_hours.close_time}**"
            else:
                # Create new hours entry
                new_hours = BusinessHours(
                    customer_id=customer_id,
                    day_of_week=day_of_week,
                    open_time=open_time or "09:00",
                    close_time=close_time or "17:00",
                    is_closed=is_closed or False,
                )
                session.add(new_hours)
                await session.commit()
                await session.refresh(new_hours)

                if new_hours.is_closed:
                    return f"✅ Set {day_name}: **Closed**"
                else:
                    return f"✅ Set {day_name}: **{new_hours.open_time} - {new_hours.close_time}**"
    except Exception as e:
        return f"❌ Failed to update business hours: {str(e)}"


@tool
async def update_service_price(
    customer_id: int,
    service_name: str,
    new_price: float,
) -> str:
    """Update the price of an existing service."""
    try:
        async with async_session() as session:
            # Find the service by name
            result = await session.execute(
                select(BusinessService).where(
                    BusinessService.customer_id == customer_id,
                    BusinessService.name == service_name,
                    BusinessService.is_available == True,
                )
            )
            service = result.scalar_one_or_none()

            if not service:
                return f"❌ Service '{service_name}' not found. Available services: {await list_business_services(customer_id)}"

            old_price = service.price
            service.price = new_price
            await session.commit()
            await session.refresh(service)

            return f"✅ Updated **{service_name}** price: ${old_price} → ${new_price}"
    except Exception as e:
        return f"❌ Failed to update service price: {str(e)}"


@tool
async def update_business_description(
    customer_id: int,
    description: str,
) -> str:
    """Update the business description."""
    try:
        async with async_session() as session:
            # Check if business description fact exists
            result = await session.execute(
                select(BusinessFact).where(
                    BusinessFact.customer_id == customer_id,
                    BusinessFact.category == "general",
                    BusinessFact.title == "Business Description",
                )
            )
            existing_fact = result.scalar_one_or_none()

            if existing_fact:
                # Update existing description
                existing_fact.content = description
                await session.commit()
                await session.refresh(existing_fact)
                return f"✅ Updated business description"
            else:
                # Create new description fact
                new_fact = BusinessFact(
                    customer_id=customer_id,
                    title="Business Description",
                    content=description,
                    category="general",
                    is_public=True,
                )
                session.add(new_fact)
                await session.commit()
                await session.refresh(new_fact)
                return f"✅ Set business description"
    except Exception as e:
        return f"❌ Failed to update business description: {str(e)}"


@tool
async def update_business_location(
    customer_id: int,
    address: str,
    service_areas: Optional[str] = None,
) -> str:
    """Update business location and service areas."""
    try:
        async with async_session() as session:
            # Update location fact
            location_result = await session.execute(
                select(BusinessFact).where(
                    BusinessFact.customer_id == customer_id,
                    BusinessFact.category == "location",
                    BusinessFact.title == "Address",
                )
            )
            location_fact = location_result.scalar_one_or_none()

            if location_fact:
                location_fact.content = address
                await session.commit()
                await session.refresh(location_fact)
            else:
                location_fact = BusinessFact(
                    customer_id=customer_id,
                    title="Address",
                    content=address,
                    category="location",
                    is_public=True,
                )
                session.add(location_fact)

            # Update service areas if provided
            if service_areas:
                areas_result = await session.execute(
                    select(BusinessFact).where(
                        BusinessFact.customer_id == customer_id,
                        BusinessFact.category == "location",
                        BusinessFact.title == "Service Areas",
                    )
                )
                areas_fact = areas_result.scalar_one_or_none()

                if areas_fact:
                    areas_fact.content = service_areas
                    await session.commit()
                    await session.refresh(areas_fact)
                else:
                    areas_fact = BusinessFact(
                        customer_id=customer_id,
                        title="Service Areas",
                        content=service_areas,
                        category="location",
                        is_public=True,
                    )
                    session.add(areas_fact)

            await session.commit()
            response = f"✅ Updated business address: **{address}**"
            if service_areas:
                response += f"\n✅ Updated service areas: **{service_areas}**"
            return response
    except Exception as e:
        return f"❌ Failed to update business location: {str(e)}"


@tool
async def add_staff_member(
    customer_id: int,
    name: str,
    role: str,
    availability: Optional[str] = None,
) -> str:
    """Add a new staff member."""
    try:
        async with async_session() as session:
            # Create staff member as a business fact
            staff_fact = BusinessFact(
                customer_id=customer_id,
                title=f"Staff: {name}",
                content=f"Role: {role}"
                + (f"\nAvailability: {availability}" if availability else ""),
                category="staff",
                is_public=True,
            )
            session.add(staff_fact)
            await session.commit()
            await session.refresh(staff_fact)

            availability_info = (
                f" with availability: {availability}" if availability else ""
            )
            return f"✅ Added staff member: **{name}** as **{role}**{availability_info}"
    except Exception as e:
        return f"❌ Failed to add staff member: {str(e)}"


@tool
async def update_appointment_availability(
    customer_id: int,
    date: str,
    is_available: bool,
    reason: Optional[str] = None,
) -> str:
    """Update appointment availability for a specific date."""
    try:
        async with async_session() as session:
            # Create availability fact
            status = "available" if is_available else "unavailable"
            content = f"Date: {date}\nStatus: {status}"
            if reason:
                content += f"\nReason: {reason}"

            availability_fact = BusinessFact(
                customer_id=customer_id,
                title=f"Availability: {date}",
                content=content,
                category="availability",
                is_public=True,
            )
            session.add(availability_fact)
            await session.commit()
            await session.refresh(availability_fact)

            reason_info = f" ({reason})" if reason else ""
            return f"✅ Updated availability for {date}: **{status}**{reason_info}"
    except Exception as e:
        return f"❌ Failed to update appointment availability: {str(e)}"


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


@app.get("/api/customers/telegram/{telegram_id}", response_model=CustomerModel)
async def get_customer_by_telegram(telegram_id: str):
    async with async_session() as session:
        result = await session.execute(
            select(Customer).where(Customer.telegram_id == telegram_id)
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


@app.get("/api/services/{customer_id}", response_model=List[ServiceModel])
async def get_services(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Service).where(Service.customer_id == customer_id)
        )
        services = result.scalars().all()
        return services


@app.post("/api/services", response_model=ServiceModel)
async def create_service(service: ServiceModel):
    new_service = Service(
        customer_id=service.customer_id,
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


@app.put("/api/services/{service_id}", response_model=ServiceModel)
async def update_service(service_id: int, service: ServiceModel):
    async with async_session() as session:
        result = await session.execute(select(Service).where(Service.id == service_id))
        existing_service = result.scalar_one_or_none()
        if existing_service:
            existing_service.name = service.name
            existing_service.description = service.description
            existing_service.price = service.price
            existing_service.duration = service.duration
            await session.commit()
            await session.refresh(existing_service)
            return existing_service
        return {"error": "Service not found"}


@app.get("/api/inventory/{customer_id}", response_model=List[InventoryModel])
async def get_inventory(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(InventoryItem).where(InventoryItem.customer_id == customer_id)
        )
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


@app.get("/api/appointments/{customer_id}", response_model=List[AppointmentModel])
async def get_appointments(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Appointment).where(Appointment.customer_id == customer_id)
        )
        appointments = result.scalars().all()
        return appointments


@app.post("/api/appointments", response_model=AppointmentModel)
async def create_appointment(appointment: AppointmentModel):
    new_appointment = Appointment(
        customer_id=appointment.customer_id,
        service_id=appointment.service_id,
        date=appointment.date,
        time=appointment.time,
        status=appointment.status,
        notes=appointment.notes,
    )
    async with async_session() as session:
        session.add(new_appointment)
        await session.commit()
        await session.refresh(new_appointment)
        return new_appointment


@app.get("/api/invoices", response_model=List[InvoiceModel])
async def get_invoices():
    async with async_session() as session:
        result = await session.execute(select(Invoice))
        invoices = result.scalars().all()
        return invoices


@app.post("/api/invoices", response_model=InvoiceModel)
async def create_invoice(invoice: InvoiceModel):
    new_invoice = Invoice(
        customer_id=invoice.customer_id,
        appointment_id=invoice.appointment_id,
        total_amount=invoice.total_amount,
        status=invoice.status,
        created_date=invoice.created_date,
        due_date=invoice.due_date,
        items=invoice.items,
    )
    async with async_session() as session:
        session.add(new_invoice)
        await session.commit()
        await session.refresh(new_invoice)
        return new_invoice


@app.get("/api/business-hours/{customer_id}", response_model=List[BusinessHoursModel])
async def get_business_hours(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessHours).where(BusinessHours.customer_id == customer_id)
        )
        hours = result.scalars().all()
        return hours


@app.post("/api/business-hours", response_model=BusinessHoursModel)
async def create_business_hours(hours: BusinessHoursModel):
    new_hours = BusinessHours(
        customer_id=hours.customer_id,
        day_of_week=hours.day_of_week,
        open_time=hours.open_time,
        close_time=hours.close_time,
        is_closed=hours.is_closed,
    )
    async with async_session() as session:
        session.add(new_hours)
        await session.commit()
        await session.refresh(new_hours)
        return new_hours


@app.put("/api/business-hours/{hours_id}", response_model=BusinessHoursModel)
async def update_business_hours_endpoint(hours_id: int, hours: BusinessHoursModel):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessHours).where(BusinessHours.id == hours_id)
        )
        existing_hours = result.scalar_one_or_none()
        if existing_hours:
            existing_hours.day_of_week = hours.day_of_week
            existing_hours.open_time = hours.open_time
            existing_hours.close_time = hours.close_time
            existing_hours.is_closed = hours.is_closed
            await session.commit()
            await session.refresh(existing_hours)
            return existing_hours
        return {"error": "Business hours not found"}


@app.get("/api/policies/{customer_id}", response_model=List[PolicyModel])
async def get_policies(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Policy).where(Policy.customer_id == customer_id)
        )
        policies = result.scalars().all()
        return policies


@app.post("/api/policies", response_model=PolicyModel)
async def create_policy(policy: PolicyModel):
    new_policy = Policy(
        title=policy.title,
        content=policy.content,
        category=policy.category,
    )
    async with async_session() as session:
        session.add(new_policy)
        await session.commit()
        await session.refresh(new_policy)
        return new_policy


@app.get("/api/business-facts/{customer_id}", response_model=List[BusinessFactModel])
async def get_business_facts(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessFact).where(
                BusinessFact.customer_id == customer_id, BusinessFact.is_public == True
            )
        )
        facts = result.scalars().all()
        return facts


@app.post("/api/business-facts", response_model=BusinessFactModel)
async def create_business_fact(fact: BusinessFactModel):
    new_fact = BusinessFact(
        customer_id=fact.customer_id,
        title=fact.title,
        content=fact.content,
        category=fact.category,
        is_public=fact.is_public,
    )
    async with async_session() as session:
        session.add(new_fact)
        await session.commit()
        await session.refresh(new_fact)
        return new_fact


@app.get(
    "/api/business-services/{customer_id}", response_model=List[BusinessServiceModel]
)
async def get_business_services(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessService).where(
                BusinessService.customer_id == customer_id,
                BusinessService.is_available == True,
            )
        )
        services = result.scalars().all()
        return services


@app.post("/api/business-services", response_model=BusinessServiceModel)
async def create_business_service(service: BusinessServiceModel):
    new_service = BusinessService(
        customer_id=service.customer_id,
        name=service.name,
        description=service.description,
        category=service.category,
        price=service.price,
        duration=service.duration,
        is_available=service.is_available,
        custom_data=service.custom_data,
    )
    async with async_session() as session:
        session.add(new_service)
        await session.commit()
        await session.refresh(new_service)
        return new_service


@app.get(
    "/api/unanswered-questions/{customer_id}",
    response_model=List[UnansweredQuestionModel],
)
async def get_unanswered_questions(customer_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(UnansweredQuestion).where(
                UnansweredQuestion.customer_id == customer_id
            )
        )
        questions = result.scalars().all()
        return questions


@app.post("/api/unanswered-questions", response_model=UnansweredQuestionModel)
async def create_unanswered_question(question: UnansweredQuestionModel):
    new_question = UnansweredQuestion(
        customer_id=question.customer_id,
        question=question.question,
        timestamp=question.timestamp,
        status=question.status,
        response=question.response,
    )
    async with async_session() as session:
        session.add(new_question)
        await session.commit()
        await session.refresh(new_question)
        return new_question


@app.put(
    "/api/unanswered-questions/{question_id}", response_model=UnansweredQuestionModel
)
async def update_unanswered_question(
    question_id: int, question: UnansweredQuestionModel
):
    async with async_session() as session:
        result = await session.execute(
            select(UnansweredQuestion).where(UnansweredQuestion.id == question_id)
        )
        db_question = result.scalar_one_or_none()
        if not db_question:
            raise HTTPException(status_code=404, detail="Question not found")

        db_question.status = question.status
        db_question.response = question.response
        await session.commit()
        await session.refresh(db_question)
        return db_question


@app.post("/api/chat")
async def chat(chat_message: ChatMessage):
    response_text = ""
    # Use API key from request if provided, otherwise fall back to environment variable
    api_key = chat_message.api_key or watsonx_api_key
    if not api_key:
        # Mock response for testing
        response_text = f"Got it! I've processed your request: '{chat_message.message}'. This is a mock response since LLM credentials are not configured."
    else:
        try:
            llm = ChatWatsonx(
                model="meta-llama/llama-3-70b-instruct",
                watsonx_api_key=api_key,
                watsonx_url="https://us-south.ml.cloud.ibm.com",
                watsonx_project_id="your-project-id",
                max_tokens=512,
            )

            # Bind tools if customer_id is provided
            if chat_message.customer_id:
                # Temporarily disable tools to test basic LLM functionality
                llm_with_tools = llm

                system_content = f"""You are a helpful assistant for managing a business. You have access to the customer's data via tools.

Customer ID: {chat_message.customer_id}

**IMPORTANT**: For ANY question about the business, ALWAYS check the business facts first using search_business_facts or get_customer_business_facts before providing information. The business facts are the primary source of truth.

Available tools include:
- get_customer_schedule: Complete schedule with business hours and appointments
- get_customer_services: List of services offered
- get_customer_appointments: Individual appointments
- get_customer_revenue: Revenue information
- get_customer_business_hours: Business operating hours
- get_customer_inventory: Product inventory
- get_all_customers: List of all customers in the system
- get_customer_business_facts: Public business information and facts
- search_business_facts: Search business facts for specific information using keywords
- add_business_fact: Store new business information in the knowledge base
- list_business_services: Get all available business services and offerings (dynamic format for any business type)
- search_business_services: Search for specific business services by name or description
- add_business_service: Add a new business service or offering (supports flexible business types)
- store_unanswered_question: Store unanswered questions for owner review

**RESPONSE STRATEGY**:
1. When asked about business information (location, hours, policies, services, etc.), FIRST use search_business_facts with relevant keywords
2. If no information is found, then check other tools or ask for clarification
3. When customers provide new information about the business, use add_business_fact to store it for future reference
4. If you cannot answer a customer's question after checking all available information, use store_unanswered_question to save it for the business owner to review and respond manually
5. Always confirm with the customer before storing new information

Format your responses using Markdown for better readability:
- Use bullet points for lists
- Use **bold** for emphasis
- Use proper formatting for data presentation
- Keep responses clear and structured"""

                messages = [
                    SystemMessage(content=system_content),
                    HumanMessage(content=chat_message.message),
                ]

                # Invoke with tool calling
                response = llm_with_tools.invoke(messages)

                # If there are tool calls, execute them
                if hasattr(response, "tool_calls") and response.tool_calls:
                    tool_results = []
                    for tool_call in response.tool_calls:
                        tool_name = tool_call["name"]
                        tool_args = tool_call["args"]
                        # Add customer_id to args if not present
                        if "customer_id" not in tool_args and chat_message.customer_id:
                            tool_args["customer_id"] = chat_message.customer_id

                        # Execute the tool
                        if tool_name == "get_customer_services":
                            result = await get_customer_services(**tool_args)
                        elif tool_name == "get_customer_appointments":
                            result = await get_customer_appointments(**tool_args)
                        elif tool_name == "get_customer_schedule":
                            result = await get_customer_schedule(**tool_args)
                        elif tool_name == "get_customer_revenue":
                            result = await get_customer_revenue(**tool_args)
                        elif tool_name == "get_customer_business_hours":
                            result = await get_customer_business_hours(**tool_args)
                        elif tool_name == "get_customer_inventory":
                            result = await get_customer_inventory(**tool_args)
                        elif tool_name == "get_all_customers":
                            result = await get_all_customers(**tool_args)
                        elif tool_name == "get_customer_business_facts":
                            result = await get_customer_business_facts(**tool_args)
                        elif tool_name == "search_business_facts":
                            result = await search_business_facts(**tool_args)
                        elif tool_name == "add_business_fact":
                            result = await add_business_fact(**tool_args)
                        elif tool_name == "list_business_services":
                            result = await list_business_services(**tool_args)
                        elif tool_name == "search_business_services":
                            result = await search_business_services(**tool_args)
                        elif tool_name == "add_business_service":
                            result = await add_business_service(**tool_args)
                        elif tool_name == "store_unanswered_question":
                            result = await store_unanswered_question(**tool_args)
                        elif tool_name == "update_business_hours":
                            result = await update_business_hours(**tool_args)
                        elif tool_name == "update_service_price_chat":
                            result = await update_service_price_chat(**tool_args)
                        elif tool_name == "update_business_description_chat":
                            result = await update_business_description_chat(**tool_args)
                        elif tool_name == "update_business_location_chat":
                            result = await update_business_location_chat(**tool_args)
                        elif tool_name == "add_staff_member_chat":
                            result = await add_staff_member_chat(**tool_args)
                        elif tool_name == "update_appointment_availability_chat":
                            result = await update_appointment_availability_chat(
                                **tool_args
                            )
                        else:
                            result = "Unknown tool"

                        tool_results.append(result)

                    # Combine results and generate final response
                    tool_summary = "\n\n".join(tool_results)
                    final_messages = messages + [
                        response,
                        SystemMessage(content=f"Tool results:\n{tool_summary}"),
                    ]
                    final_response = llm.invoke(final_messages)
                    response_text = final_response.content
                else:
                    response_text = response.content
            else:
                # No customer_id, use basic LLM
                messages = [
                    SystemMessage(
                        content="You are a helpful assistant for managing a business. You can help with updating services, scheduling, customer management, and other business operations."
                    ),
                    HumanMessage(content=chat_message.message),
                ]
                response = llm.invoke(messages)
                response_text = response.content

        except Exception as e:
            response_text = f"Got it! I've processed your request: '{chat_message.message}'. This is a mock response since LLM credentials are invalid or not configured. Error: {str(e)}"

    # Log the action
    try:
        from datetime import datetime

        # Only log if we have a customer_id (for authenticated chats)
        if chat_message.customer_id is not None:
            log_entry = Log(
                customer_id=chat_message.customer_id,
                timestamp=datetime.now().isoformat(),
                action="chat",
                details=f"Message: {chat_message.message}, Response: {response_text}",
            )
            async with async_session() as session:
                session.add(log_entry)
                await session.commit()
    except Exception as e:
        print(f"Error logging chat action: {e}")

    return {"response": response_text}


@app.get("/api/revenue/{customer_id}")
async def get_revenue(customer_id: int, date: str = "today"):
    from datetime import datetime, timedelta

    if date == "today":
        today = datetime.now().date()
        start_date = today.isoformat()
        end_date = (today + timedelta(days=1)).isoformat()
    else:
        # Assume date is in YYYY-MM-DD format
        start_date = date
        end_date = (datetime.fromisoformat(date) + timedelta(days=1)).isoformat()

    async with async_session() as session:
        # Get revenue from paid invoices
        result = await session.execute(
            select(Invoice).where(
                Invoice.customer_id == customer_id,
                Invoice.status == "paid",
                Invoice.created_date >= start_date,
                Invoice.created_date < end_date,
            )
        )
        invoices = result.scalars().all()
        total_revenue = sum(invoice.total_amount for invoice in invoices)

        return {
            "date": date,
            "total_revenue": total_revenue,
            "invoice_count": len(invoices),
        }


# Business Services CRUD endpoints
@app.put("/api/business-services/{service_id}", response_model=BusinessServiceModel)
async def update_business_service(service_id: int, service: BusinessServiceModel):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessService).where(BusinessService.id == service_id)
        )
        existing_service = result.scalar_one_or_none()
        if existing_service:
            existing_service.name = service.name
            existing_service.description = service.description
            existing_service.category = service.category
            existing_service.price = service.price
            existing_service.duration = service.duration
            existing_service.is_available = service.is_available
            existing_service.custom_data = service.custom_data
            await session.commit()
            await session.refresh(existing_service)
            return existing_service
        return {"error": "Business service not found"}


@app.delete("/api/business-services/{service_id}")
async def delete_business_service(service_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessService).where(BusinessService.id == service_id)
        )
        service = result.scalar_one_or_none()
        if service:
            await session.delete(service)
            await session.commit()
            return {"message": "Business service deleted successfully"}
        return {"error": "Business service not found"}


# Business Facts CRUD endpoints
@app.put("/api/business-facts/{fact_id}", response_model=BusinessFactModel)
async def update_business_fact(fact_id: int, fact: BusinessFactModel):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessFact).where(BusinessFact.id == fact_id)
        )
        existing_fact = result.scalar_one_or_none()
        if existing_fact:
            existing_fact.title = fact.title
            existing_fact.content = fact.content
            existing_fact.category = fact.category
            existing_fact.is_public = fact.is_public
            await session.commit()
            await session.refresh(existing_fact)
            return existing_fact
        return {"error": "Business fact not found"}


@app.delete("/api/business-facts/{fact_id}")
async def delete_business_fact(fact_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(BusinessFact).where(BusinessFact.id == fact_id)
        )
        fact = result.scalar_one_or_none()
        if fact:
            await session.delete(fact)
            await session.commit()
            return {"message": "Business fact deleted successfully"}
        return {"error": "Business fact not found"}


# Customer update endpoint
@app.put("/api/customers/{customer_id}", response_model=CustomerModel)
async def update_customer(customer_id: int, customer: CustomerModel):
    async with async_session() as session:
        result = await session.execute(
            select(Customer).where(Customer.id == customer_id)
        )
        existing_customer = result.scalar_one_or_none()
        if existing_customer:
            existing_customer.name = customer.name
            existing_customer.email = customer.email
            existing_customer.phone = customer.phone
            existing_customer.business_name = customer.business_name
            existing_customer.business_type = customer.business_type
            existing_customer.business_address = customer.business_address
            existing_customer.telegram_id = customer.telegram_id
            await session.commit()
            await session.refresh(existing_customer)
            return existing_customer
        return {"error": "Customer not found"}


# Policy CRUD endpoints
@app.put("/api/policies/{policy_id}", response_model=PolicyModel)
async def update_policy(policy_id: int, policy: PolicyModel):
    async with async_session() as session:
        result = await session.execute(select(Policy).where(Policy.id == policy_id))
        existing_policy = result.scalar_one_or_none()
        if existing_policy:
            existing_policy.title = policy.title
            existing_policy.content = policy.content
            existing_policy.category = policy.category
            await session.commit()
            await session.refresh(existing_policy)
            return existing_policy
        return {"error": "Policy not found"}


@app.delete("/api/policies/{policy_id}")
async def delete_policy(policy_id: int):
    async with async_session() as session:
        result = await session.execute(select(Policy).where(Policy.id == policy_id))
        policy = result.scalar_one_or_none()
        if policy:
            await session.delete(policy)
            await session.commit()
            return {"message": "Policy deleted successfully"}
        return {"error": "Policy not found"}


# Inventory CRUD endpoints
@app.put("/api/inventory/{item_id}", response_model=InventoryModel)
async def update_inventory_item(item_id: int, item: InventoryModel):
    async with async_session() as session:
        result = await session.execute(
            select(InventoryItem).where(InventoryItem.id == item_id)
        )
        existing_item = result.scalar_one_or_none()
        if existing_item:
            existing_item.name = item.name
            existing_item.quantity = item.quantity
            existing_item.price = item.price
            existing_item.category = item.category
            await session.commit()
            await session.refresh(existing_item)
            return existing_item
        return {"error": "Inventory item not found"}


@app.delete("/api/inventory/{item_id}")
async def delete_inventory_item(item_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(InventoryItem).where(InventoryItem.id == item_id)
        )
        item = result.scalar_one_or_none()
        if item:
            await session.delete(item)
            await session.commit()
            return {"message": "Inventory item deleted successfully"}
        return {"error": "Inventory item not found"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
