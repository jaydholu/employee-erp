import re
import random
import requests
from faker import Faker


fake = Faker()
BASE_URL = "http://localhost:8000"

# ---- LOGIN ----
login_data = {
    "username": "admin",                            # your admin username
    "password": "admin@company"                     # your admin password
}

print(login_data.get("username"), login_data.get("password"))

login = requests.post(f"{BASE_URL}/auth/login", data=login_data)
token = login.json().get("access_token")

if not token:
    print("Login failed:", login.text)
    exit()

headers = {
    "Authorization": f"Bearer {token}"
}

departments = [
    "Engineering",
    "Human Resources",
    "Finance",
    "Marketing",
    "Sales"
]

positions = [
    "Software Engineer",
    "Senior Engineer",
    "Manager",
    "Head",
    "Analyst",
    "Team Lead"
]


for i in range(500):
    full_name = fake.name()
    username = re.sub(r'[^a-z]', '', full_name.lower()) + str(random.randint(100, 999))
    payload = {
        "user": {
            "fullname": full_name,
            "username": username,
            "email": f"{username}@company.com",
            "role": "employee",
            "password": f"{username}@company",
        },
        "employee": {
            "department": random.choice(departments),
            "position": random.choice(positions),
            "joining_date": str(fake.date_between(start_date="-5y", end_date="today")),
            "salary": random.randint(30000, 1200000)
        },
    }

    r = requests.post(
        f"{BASE_URL}/employees/",
        json=payload,
        headers=headers
    )

    print(f"Name: {payload.get('user').get('fullname')}\n"
          f"Username: {payload.get('user').get('username')}\n"
          f"Email: {payload.get('user').get('email')}\n"
          f"Role: {payload.get('user').get('role')}\n"
          f"Department: {payload.get('employee').get('department')}\n"
          f"Position: {payload.get('employee').get('position')}\n"
          f"Joining_date: {payload.get('employee').get('joining_date')}\n"
          f"Salary: {payload.get('employee').get('salary')}")

    print(f"{i+1}/500 -> {r.status_code}\n")
