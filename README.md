# 📮 Unseal

**Time-capsule messaging for the digital age**

Unseal is a web application that allows users to create time-locked messages that can only be opened at a future date. Write letters to your future self, schedule surprises for loved ones, or preserve memories to be revealed at the perfect moment.

## ✨ Features

- **📝 Multi-format Messages**: Create text, audio, or video messages
- **⏰ Flexible Scheduling**: Set delivery dates days, months, or years in the future
- **🔒 Secure Storage**: Messages are safely stored until their reveal date
- **📱 Modern Interface**: Clean, intuitive design built with Vue 3

## 🚀 Demo

[Work in Progress]

## 🛠️ Tech Stack

- **Frontend**: Vue 3, Vue Router
- **Backend**: Supabase (Database, Authentication, Storage)
- **Build Tool**: Vite
- **Styling**: CSS3
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account and project

## ⚡ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/unseal.git
   cd unseal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` to see the app in action!

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new project in [Supabase](https://supabase.com/dashboard)
2. Set up the following tables in your Supabase database:

```sql
-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'audio', 'video'
  scheduled_date TIMESTAMP WITH TIME ZONE,
  delivery_method VARCHAR(50) DEFAULT 'in-app', -- 'in-app', 'email'
  is_revealed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = user_id);
```

3. Configure authentication providers in Supabase (email, Google, etc.)

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
unseal/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Stylesheets and images
│   ├── components/        # Reusable Vue components
│   │   └── AuthForm.vue   # Authentication component
│   ├── lib/               # Utility libraries
│   │   └── supabaseClient.js  # Supabase configuration
│   ├── router/            # Vue Router configuration
│   ├── App.vue            # Root component
│   ├── HomePage.vue       # Main application page
│   ├── RootPage.vue       # Landing/root page
│   └── main.js            # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style (enforced by ESLint and Prettier)
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/yourusername/unseal/issues) with:

- A clear description of the problem/feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/) and [Vite](https://vitejs.dev/)
- Powered by [Supabase](https://supabase.com/) for backend services
- Icons and design inspiration from various open-source projects

## 📬 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/unseal](https://github.com/yourusername/unseal)

---

⭐ If you found this project helpful, please give it a star on GitHub!
