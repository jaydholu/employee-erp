"""
CLI script to manage admin users via the Employee ERP API.

Commands
--------
  create:   Create a new admin account
  edit  :   Update an existing admin's details (fullname / username / email / password)
  delete:   Delete an admin account (cannot delete the last admin)

Usage
-----
  # Interactive mode (prompts for everything)
  python create_admin.py create
  python create_admin.py edit   <target-username>
  python create_admin.py delete <target-username>

  # One-liner mode
  python create_admin.py create \\
      --auth-user admin --auth-pass admin@company \\
      --fullname "Jane HR" --username janeadmin \\
      --email jane@company.com --password jane@company

  python create_admin.py edit janeadmin \\
      --auth-user admin --auth-pass admin@company \\
      --fullname "Jane Smith"  --email jane.smith@company.com

  python create_admin.py delete janeadmin \\
      --auth-user admin --auth-pass admin@company

Requirements:
  requests  (already in requirements.txt)
"""

import sys
import argparse
import getpass
import requests


BASE_URL = "http://localhost:8000"


# ── auth helper ───────────────────────────────────────────────────────────────
def get_token(auth_user: str, auth_pass: str) -> str:
    resp = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": auth_user, "password": auth_pass},
    )
    if resp.status_code != 200:
        print(f"Login failed: {resp.json().get('detail', resp.text)}")
        sys.exit(1)
    token = resp.json()["access_token"]
    print("Authenticated.\n")
    return token


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def prompt_auth(args) -> str:
    auth_user = args.auth_user or input("Your admin username : ").strip()
    auth_pass = args.auth_pass or getpass.getpass("Your admin password : ")
    return get_token(auth_user, auth_pass)


# ── create ────────────────────────────────────────────────────────────────────
def cmd_create(args):
    print("=== Create Admin ===\n")
    token = prompt_auth(args)
    fullname = args.fullname or input("New admin full name  : ").strip()
    username = args.username or input("New admin username   : ").strip()
    email = args.email or input("New admin email      : ").strip()
    password = args.password or getpass.getpass("New admin password   : ")

    resp = requests.post(
        f"{BASE_URL}/secret/admin/",
        json={"fullname": fullname, "username": username,
              "email": email, "password": password},
        headers=auth_headers(token),
    )
    if resp.status_code == 201:
        d = resp.json()
        print(f"\nAdmin created successfully!")
        print(f"    ID       : {d['id']}")
        print(f"    Name     : {d['fullname']}")
        print(f"    Username : {d['username']}")
        print(f"    Email    : {d['email']}")
        print(f"    Role     : {d['role']}")
    else:
        print(f"Creating Failed: {resp.json().get('detail', resp.text)}")
        sys.exit(1)


# ── edit ──────────────────────────────────────────────────────────────────────
def cmd_edit(args):
    # resolve target username
    target = args.target_username
    if not target:
        target = input("Username of admin to edit : ").strip()

    print(f"=== Edit Admin — '{target}' ===\n")
    print("Leave a field blank to keep the current value.\n")

    token = prompt_auth(args)

    # collect only the fields the user actually wants to change
    payload = {}

    fullname = args.fullname if args.fullname is not None else input("New full name  (blank = no change) : ").strip()
    username = args.username if args.username is not None else input("New username   (blank = no change) : ").strip()
    email = args.email if args.email is not None else input("New email      (blank = no change) : ").strip()

    # password is special — use getpass but allow skipping
    if args.password is not None:
        password = args.password
    else:
        password = getpass.getpass("New password   (blank = no change) : ")

    if fullname:
        payload["fullname"] = fullname
    if username:
        payload["username"] = username
    if email:
        payload["email"] = email
    if password:
        payload["password"] = password

    if not payload:
        print("Nothing to update — no fields provided.")
        return

    resp = requests.put(
        f"{BASE_URL}/secret/admin/edit/{target}",
        json=payload,
        headers=auth_headers(token),
    )
    if resp.status_code == 200:
        d = resp.json()
        print(f"\nAdmin updated successfully!")
        print(f"    ID       : {d['id']}")
        print(f"    Name     : {d['fullname']}")
        print(f"    Username : {d['username']}")
        print(f"    Email    : {d['email']}")
        print(f"    Role     : {d['role']}")
    else:
        print(f"Editing Failed: {resp.json().get('detail', resp.text)}")
        sys.exit(1)


# ── delete ────────────────────────────────────────────────────────────────────
def cmd_delete(args):
    target = args.target_username
    if not target:
        target = input("Username of admin to delete : ").strip()

    print(f"=== Delete Admin — '{target}' ===\n")
    print("This action is irreversible.\n")

    token = prompt_auth(args)

    # Confirm unless --yes flag was passed
    if not args.yes:
        confirm = input(f"Type the username '{target}' again to confirm deletion : ").strip()
        if confirm != target:
            print("Confirmation did not match. Aborting.")
            sys.exit(1)

    resp = requests.delete(
        f"{BASE_URL}/secret/admin/delete/{target}",
        headers=auth_headers(token),
    )
    if resp.status_code == 200:
        print(f"\n{resp.json()['message']}")
    else:
        print(f"Deleting Failed: {resp.json().get('detail', resp.text)}")
        sys.exit(1)


# ── CLI wiring ────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="Employee ERP — Admin management CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # shared auth flags
    def add_auth(p):
        p.add_argument("--auth-user", help="Your admin username")
        p.add_argument("--auth-pass", help="Your admin password")

    # shared new-user flags
    def add_user_fields(p):
        p.add_argument("--fullname", help="Full name")
        p.add_argument("--username", help="Username")
        p.add_argument("--email", help="Email address")
        p.add_argument("--password", help="Password")

    # create
    p_create = sub.add_parser("create", help="Create a new admin")
    add_auth(p_create)
    add_user_fields(p_create)

    # edit
    p_edit = sub.add_parser("edit", help="Edit an admin's details")
    p_edit.add_argument("target_username", nargs="?", default=None,
                        help="Username of the admin to edit")
    add_auth(p_edit)
    add_user_fields(p_edit)

    # delete
    p_delete = sub.add_parser("delete", help="Delete an admin account")
    p_delete.add_argument("target_username", nargs="?", default=None,
                          help="Username of the admin to delete")
    add_auth(p_delete)
    p_delete.add_argument("--yes", action="store_true",
                          help="Skip confirmation prompt")

    args = parser.parse_args()

    if args.command == "create":
        cmd_create(args)
    elif args.command == "edit":
        cmd_edit(args)
    elif args.command == "delete":
        cmd_delete(args)


if __name__ == "__main__":
    main()
