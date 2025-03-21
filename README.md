# GestionFormation

## Setup Instructions

Follow these steps to set up the project after cloning it from GitHub:

### 1. Clone the Repository
```bash
git clone https://github.com/mouana/gestionformation.git
cd GestionFormation
```

### 2. Install Laravel Dependencies
```bash
composer install
```

### 3. Set Up Environment File
```bash
cp .env.example .env
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Run Migrations
```bash
php artisan migrate
```

### 6. Start the Development Server
```bash
php artisan serve
```

Now, your GestionFormation application should be up and running!
