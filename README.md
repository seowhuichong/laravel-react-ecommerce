# Big Pharmacy eCommerce Sample

An interactive, multi-language eCommerce platform built with **Laravel** (Backend API), **React** (Frontend SPA), and **MySQL** (Database). This project demonstrates high-performance routing, dynamic localization, and a seamless shopping experience.

---

## 🚀 Tech Stack

- **Frontend**: React 18 (Hooks), React Router 6 (SPA), Tailwind CSS.
- **Backend**: Laravel 10/11 (RESTful API), Eloquent ORM.
- **Database**: MySQL with relational translation mapping for localized content.
- **Localization**: Dynamic URL-based locale switching (`/en`, `/ms`, `/zh`) with product-specific slug management.

---

## ✨ Key Features

- **Dynamic Language Switcher**: Seamless switching between English, Bahasa Melayu, and Chinese without full page reloads.
- **Advanced Product Routing**: Support for language-specific friendly URLs (e.g., `/en/product/my-item` vs `/ms/product/item-pertama-saya`).
- **Global State Management**: React Context API used for locale persistence and API header synchronization.
- **Mega Menu Navigation**: High-fidelity category tabs and interactive search bar tailored for medical and personal care retail.

---

## 🛠️ Installation & Setup

### 1. Backend (Laravel)
```bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Install PHP dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations and seeders (if available)
php artisan migrate