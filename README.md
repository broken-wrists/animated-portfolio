# Digital Artisan Portfolio

A stunning, highly animated portfolio website built with Next.js 14, featuring advanced 3D animations, interactive particle systems, and cutting-edge web technologies.

## 🚀 Features

### ✨ Visual Excellence
- **3D Particle System**: Interactive particles using Three.js with mouse-reactive behaviors
- **Advanced Animations**: Powered by Framer Motion and GSAP with scroll-triggered effects
- **Glitch Typography**: Dynamic text effects with customizable intensity
- **Morphing Shapes**: Organic background animations with CSS keyframes
- **Gradient Animations**: Beautiful color transitions and shimmer effects

### 🎯 Performance Optimized
- **Mobile-First Design**: Responsive across all device sizes
- **Performance Monitoring**: Optimized for 60fps animations
- **Lazy Loading**: Components load only when needed
- **Reduced Motion Support**: Respects `prefers-reduced-motion` settings
- **Progressive Enhancement**: Graceful fallbacks for low-performance devices

### 🔧 Technical Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom animations
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion + GSAP + ScrollTrigger
- **Language**: TypeScript for type safety
- **Deployment**: Optimized for Vercel

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd animated-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx          # Main page component
│   └── globals.css       # Global styles and animations
├── components/
│   ├── animations/       # Reusable animation components
│   │   ├── RevealAnimation.tsx
│   │   ├── GlitchText.tsx
│   │   ├── ScrollReveal.tsx
│   │   └── ParallaxSection.tsx
│   ├── sections/         # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── ContactSection.tsx
│   ├── three/           # Three.js components
│   │   └── ParticleField.tsx
│   └── ui/              # UI components
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── LoadingScreen.tsx
├── hooks/               # Custom React hooks
│   ├── useScrollTrigger.ts
│   ├── useMousePosition.ts
│   └── useIntersectionObserver.ts
├── utils/               # Utility functions
│   └── animations.ts    # Animation variants
└── types/               # TypeScript type definitions
    └── index.ts
```

## 🎨 Customization

### Color Scheme
The portfolio uses a cyber-inspired color palette defined in `tailwind.config.ts`:
- **Neon Green**: `#39ff14`
- **Electric Blue**: `#007fff`
- **Deep Purple**: `#4a0080`
- **Cyber Pink**: `#ff1493`
- **Dark Background**: `#0a0a0a`

### Animation Settings
Customize animations in `src/utils/animations.ts` and `src/app/globals.css`

### Content Updates
Update personal information in:
- `src/components/sections/HeroSection.tsx` - Main intro and stats
- `src/components/sections/AboutSection.tsx` - Bio and skills
- `src/components/sections/ProjectsSection.tsx` - Portfolio projects
- `src/components/sections/ContactSection.tsx` - Contact information

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with optimal settings

### Manual Build
```bash
npm run build
npm start
```

## 📱 Mobile Optimization

The portfolio automatically optimizes for mobile devices:
- Reduced particle count on mobile
- Simplified animations for better performance
- Touch-friendly interactions
- Responsive grid layouts

## ♿ Accessibility

- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Reduced Motion**: Respects user motion preferences
- **Color Contrast**: WCAG compliant color schemes
- **Focus Indicators**: Clear focus states for all interactive elements

## 🧪 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help customizing the portfolio, feel free to reach out!

---

**Built with ❤️ and lots of coffee** ☕