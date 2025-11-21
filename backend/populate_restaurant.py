import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from main import (
    Base,
    Customer,
    BusinessService,
    BusinessFact,
    BusinessHours,
    Log,
)
from datetime import datetime


async def populate_restaurant_data():
    engine = create_async_engine("sqlite+aiosqlite:///./customers.db", echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Create restaurant customer
        restaurant_customer = Customer(
            name="Bella Vista Restaurant",
            email="info@bellavista.com",
            phone="+1234567890",
            business_name="Bella Vista",
            business_type="Fine Dining Restaurant",
            business_address="123 Gourmet Street, Downtown District",
        )
        session.add(restaurant_customer)
        await session.commit()
        await session.refresh(restaurant_customer)

        customer_id = restaurant_customer.id

        # Create restaurant business facts
        business_facts = [
            BusinessFact(
                customer_id=customer_id,
                title="Business Description",
                content="Bella Vista is an upscale fine dining restaurant specializing in contemporary Italian cuisine with a modern twist. We offer an elegant atmosphere perfect for romantic dinners, business meetings, and special celebrations.",
                category="general",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Address",
                content="123 Gourmet Street, Downtown District. Free parking available in the rear. Accessible by public transit (Metro Line 2, Gourmet Station).",
                category="location",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Phone",
                content="+1 (555) 123-4567",
                category="contact",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Cuisine Style",
                content="Contemporary Italian cuisine with farm-to-table ingredients. Specializing in handmade pasta, wood-fired pizzas, and premium steaks.",
                category="general",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Ambiance",
                content="Elegant and sophisticated dining room with soft lighting, white tablecloths, and contemporary Italian artwork. Outdoor patio seating available seasonally.",
                category="general",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Price Range",
                content="$$ - $$$ (Moderate to Expensive). Appetizers: $12-18, Main courses: $24-45, Desserts: $8-14",
                category="general",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Special Diets",
                content="We offer extensive vegetarian and vegan options. Gluten-free pasta available upon request. Please inform your server of any dietary restrictions.",
                category="general",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Reservations",
                content="Reservations recommended, especially for weekend dining. We accept reservations up to 30 days in advance. Same-day reservations accepted based on availability.",
                category="general",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Private Events",
                content="Private dining room available for parties of 12-25 guests. Custom menus and event planning services available. Contact us for pricing and availability.",
                category="services",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Wine Selection",
                content="Extensive wine list featuring over 200 selections from Italy and California. Wine pairing available for all menu items. Sommelier on staff.",
                category="services",
                is_public=True,
            ),
        ]
        session.add_all(business_facts)
        await session.commit()

        # Create restaurant business services (menu items)
        business_services = [
            # Appetizers
            BusinessService(
                customer_id=customer_id,
                name="Bruschetta Trio",
                description="Classic tomato, mushroom, and olive tapenade on toasted ciabatta",
                category="Appetizers",
                price=14.0,
                duration="10 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Calamari Fritti",
                description="Crispy squid rings with lemon aioli and marinara sauce",
                category="Appetizers",
                price=16.0,
                duration="12 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Antipasto Platter",
                description="Selection of cured meats, cheeses, olives, and marinated vegetables",
                category="Appetizers",
                price=18.0,
                duration="15 min",
                is_available=True,
            ),
            # Main Courses - Pasta
            BusinessService(
                customer_id=customer_id,
                name="Fettuccine Alfredo",
                description="House-made fettuccine with creamy parmesan sauce and black truffle",
                category="Pasta",
                price=24.0,
                duration="20 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Spaghetti Carbonara",
                description="Traditional Roman-style with pancetta, eggs, and pecorino romano",
                category="Pasta",
                price=22.0,
                duration="18 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Lobster Ravioli",
                description="House-made ravioli filled with lobster in a saffron cream sauce",
                category="Pasta",
                price=32.0,
                duration="25 min",
                is_available=True,
            ),
            # Main Courses - Meat
            BusinessService(
                customer_id=customer_id,
                name="Filet Mignon",
                description="8oz grass-fed beef with roasted potatoes and seasonal vegetables",
                category="Main Courses",
                price=45.0,
                duration="25 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Chicken Parmigiana",
                description="Breaded chicken breast with marinara sauce and melted mozzarella",
                category="Main Courses",
                price=28.0,
                duration="22 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Veal Saltimbocca",
                description="Veal cutlets with prosciutto and sage in white wine sauce",
                category="Main Courses",
                price=38.0,
                duration="23 min",
                is_available=True,
            ),
            # Pizza
            BusinessService(
                customer_id=customer_id,
                name="Margherita Pizza",
                description="San Marzano tomatoes, fresh mozzarella, basil on wood-fired crust",
                category="Pizza",
                price=18.0,
                duration="15 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Quattro Stagioni",
                description="Artichokes, mushrooms, ham, olives on wood-fired crust",
                category="Pizza",
                price=22.0,
                duration="16 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Truffle Pizza",
                description="Black truffle, mozzarella, wild mushrooms, truffle oil",
                category="Pizza",
                price="28.0",
                duration="18 min",
                is_available=True,
            ),
            # Desserts
            BusinessService(
                customer_id=customer_id,
                name="Tiramisu",
                description="Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
                category="Desserts",
                price="10.0",
                duration="5 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Panna Cotta",
                description="Vanilla bean panna cotta with mixed berry compote",
                category="Desserts",
                price="9.0",
                duration="5 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Chocolate Lava Cake",
                description="Warm chocolate cake with molten center and vanilla gelato",
                category="Desserts",
                price="12.0",
                duration="8 min",
                is_available=True,
            ),
            # Beverages
            BusinessService(
                customer_id=customer_id,
                name="House Wine",
                description="Selection of red and white wines by the glass",
                category="Beverages",
                price="12.0",
                duration="2 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Craft Cocktails",
                description="Signature Italian-inspired cocktails",
                category="Beverages",
                price="14.0",
                duration="5 min",
                is_available=True,
            ),
            BusinessService(
                customer_id=customer_id,
                name="Espresso",
                description="Traditional Italian espresso",
                category="Beverages",
                price="4.0",
                duration="2 min",
                is_available=True,
            ),
        ]
        session.add_all(business_services)
        await session.commit()

        # Create restaurant business hours
        restaurant_hours = [
            BusinessHours(
                customer_id=customer_id,
                day_of_week=0,  # Monday
                open_time="11:00",
                close_time="22:00",
                is_closed=False,
            ),
            BusinessHours(
                customer_id=customer_id,
                day_of_week=1,  # Tuesday
                open_time="11:00",
                close_time="22:00",
                is_closed=False,
            ),
            BusinessHours(
                customer_id=customer_id,
                day_of_week=2,  # Wednesday
                open_time="11:00",
                close_time="22:00",
                is_closed=False,
            ),
            BusinessHours(
                customer_id=customer_id,
                day_of_week=3,  # Thursday
                open_time="11:00",
                close_time="22:00",
                is_closed=False,
            ),
            BusinessHours(
                customer_id=customer_id,
                day_of_week=4,  # Friday
                open_time="11:00",
                close_time="23:00",
                is_closed=False,
            ),
            BusinessHours(
                customer_id=customer_id,
                day_of_week=5,  # Saturday
                open_time="17:00",
                close_time="23:00",
                is_closed=False,
            ),
            BusinessHours(
                customer_id=customer_id,
                day_of_week=6,  # Sunday
                open_time="17:00",
                close_time="21:00",
                is_closed=False,
            ),
        ]
        session.add_all(restaurant_hours)
        await session.commit()

        # Create staff information as business facts
        staff_facts = [
            BusinessFact(
                customer_id=customer_id,
                title="Staff: Chef Marco Rossi",
                content="Role: Executive Chef\nExperience: 15 years in fine dining Italian cuisine\nSpecialty: Traditional pasta techniques and modern interpretations\nAvailability: Tuesday - Saturday evenings",
                category="staff",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Staff: Isabella Martinez",
                content="Role: Head Sommelier\nExperience: Certified sommelier with 10 years experience\nSpecialty: Italian and California wine pairings\nAvailability: Wednesday - Sunday",
                category="staff",
                is_public=True,
            ),
            BusinessFact(
                customer_id=customer_id,
                title="Staff: Antonio Bianchi",
                content="Role: Maître d'\nExperience: 12 years in luxury hospitality\nSpecialty: Guest experience and private event coordination\nAvailability: All operating hours",
                category="staff",
                is_public=True,
            ),
        ]
        session.add_all(staff_facts)
        await session.commit()

        # Create log entry
        log_entry = Log(
            customer_id=customer_id,
            timestamp=datetime.now().isoformat(),
            action="restaurant_setup",
            details="Restaurant data populated with menu, hours, and business information",
        )
        session.add(log_entry)
        await session.commit()

        print(f"Restaurant data populated successfully! Customer ID: {customer_id}")
        print(f"Created {len(business_facts)} business facts")
        print(f"Created {len(business_services)} menu items")
        print(f"Created {len(restaurant_hours)} business hours entries")
        print(f"Created {len(staff_facts)} staff members")


if __name__ == "__main__":
    asyncio.run(populate_restaurant_data())
