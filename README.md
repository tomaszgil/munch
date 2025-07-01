# Munch 🍽️

A meal management application for kids that helps parents organize, discover, and manage thier favorite recipes. Built as a playground to try out modern React technologies.

## About

Munch is a meal-tracking application designed to solve the everyday problem of "What can I make for my kid to eat?" It allows you to maintain a personal database of meals, categorize them, and randomly select meals when you're indecisive.

### Why Munch Exists

- **Personal Utility**: Munch helps me maintain a personal meal database and randomly selects meals for my kids
- **Technology Showcase**: Demonstrates modern React patterns using TanStack Router for type-safe routing and Zod for runtime validation
- **Learning Platform**: A playground for experimenting with a few frontend technologies

## Features

### Core Functionality

- **Meal Management** 🍽️: Create, edit, delete, and duplicate meals with ingredients and categories
- **Categorization** 🏷️: Organize meals by type (Breakfast, Lunch, Dinner, Snack)
- **Random Meal Selection** 🎲: Get random meal suggestions with animated selection
- **Search & Filter** 🔍: Find meals by name or filter by category
- **Recent Meals** ⏰: Quick access to your recently updated meals
- **AI-Powered Chat Interface** 💬: Interactive chat with AI to generate meals based on ingredients, dietary preferences, or meal types

### Advanced Features

- **Data Export/Import** 📁: Backup and restore your meal database via JSON files
- **Analytics** 📊: View meal statistics and category breakdowns

### User Experience

- **Modern UI** 🎨: Built with Radix UI components for consistent, accessible design
- **Toast Notifications** 🔔: Real-time feedback for user actions
- **Error Handling** 🛡️: Error boundaries and schema validation
- **Privacy-Focused** 🔒: All data stays on your device - no cloud storage or data collection
- **Local-First** 💾: Works offline with local storage, no internet required
- **Cross-Platform** 📱: Responsive design that works on desktop, installable on mobile
- **Dark/Light Mode** 🌓: Automatic theme switching based on system preferences

## Technology Stack

### Core Technologies

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### AI Integration

- **Gemini Nano** - Built-in Chrome AI model for meal generation
- **Language Model API** - Chrome's Prompt API for AI integration

### Routing & State Management

- **TanStack Router** - Type-safe routing with file-based routing
- **Local Storage** - Persistent client-side data storage

### UI & Styling

- **Netlify-Inspired Design** - Clean, modern aesthetic with subtle gradients and smooth animations
- **Radix UI** - Accessible, unstyled UI components
- **Radix Themes** - Design system and theming
- **CSS Variables** - Dynamic theming support

### Validation & Utilities

- **Zod** - Runtime type validation and schema definition

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Chrome browser (for AI meal generation feature)

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

### AI Meal Generation Setup

To use the AI meal generation feature:

1. **Enable Chrome AI Features**:

   - Navigate to `chrome://flags` in your Chrome browser
   - Enable the "Prompt API for Gemini Nano" flag
   - Restart Chrome

2. **Generate Meals**:
   - Go to the "Generate" page in the app
   - Type natural language prompts like "Generate meals for a lunch with tomato, chicken, and rice"
   - The AI will suggest balanced, kid-friendly meal ideas

### Available Scripts

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm test` - Run test suite

### Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── navigation/     # Navigation components
│   └── theme/          # Theme context and utilities
├── routes/             # TanStack Router file-based routes
├── services/           # Business logic and data management
│   └── meals/          # Meal-related services and hooks
├── utils/              # Utility functions
└── styles.css          # Global styles
```

### Key Development Patterns

- **File-based Routing**: Routes are automatically generated from the `routes/` directory
- **Type-safe APIs**: All data operations are validated with Zod schemas
- **Custom Hooks**: Business logic is encapsulated in reusable hooks
- **Component Composition**: Radix UI components are composed for consistent design
- **Error Boundaries**: Graceful error handling throughout the application

### Data Persistence

Munch uses browser `localStorage` for data persistence. The app includes:

- Automatic data validation on import
- Export functionality for backups
- Reset capabilities for testing

### Testing

The project includes a testing setup with Vitest and React Testing Library. Run tests with:

```bash
pnpm test
```

## Contributing

This is a personal project, but feel free to explore the codebase and learn from the implementation patterns. The code is structured to be educational and demonstrate modern React best practices.

## License

This project is for personal use and educational purposes.
